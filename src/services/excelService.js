import { PublicClientApplication } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';

const msalConfig = {
  auth: {
    clientId: '1a2b9279-6c23-4647-bad5-57f68cc5dd65',
    authority: 'https://login.microsoftonline.com/f8e66afc-b497-4de0-ab9e-d82ca2f21666',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  }
};

class ExcelService {
  constructor() {
    this.msalInstance = null;
    this.graphClient = null;
    this._isInitialized = false;
  }

  get isInitialized() {
    return this._isInitialized;
  }

  async initialize() {
    if (this._isInitialized) return;

    try {
      this.msalInstance = new PublicClientApplication(msalConfig);
      await this.msalInstance.initialize();
      
      // Check for existing session
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await this.initializeGraphClient(accounts[0]);
      } else {
        await this.login();
      }
      
      this._isInitialized = true;
    } catch (error) {
      console.error('Excel service initialization failed:', error);
      this._isInitialized = false;
      throw new Error(`Initialization failed: ${error.message}`);
    }
  }

  async login() {
    try {
      const loginRequest = {
        scopes: ['Files.ReadWrite', 'Sites.ReadWrite.All', 'User.Read']
      };

      const loginResponse = await this.msalInstance.loginPopup(loginRequest);
      console.log('Login successful');
      await this.initializeGraphClient(loginResponse.account);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async initializeGraphClient(account) {
    try {
      const tokenRequest = {
        scopes: ['Files.ReadWrite', 'Sites.ReadWrite.All', 'User.Read'],
        account: account
      };

      const token = await this.msalInstance.acquireTokenSilent(tokenRequest);
      
      this.graphClient = Client.init({
        authProvider: (done) => {
          done(null, token.accessToken);
        }
      });
    } catch (error) {
      console.error('Failed to initialize Graph client:', error);
      if (error.name === 'InteractionRequiredAuthError') {
        await this.login();
      } else {
        throw error;
      }
    }
  }

  async ensureAuthenticated() {
    if (!this.graphClient) {
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        await this.login();
      } else {
        try {
          await this.initializeGraphClient(accounts[0]);
        } catch (error) {
          if (error.name === 'InteractionRequiredAuthError') {
            await this.login();
          } else {
            throw error;
          }
        }
      }
    }
  }

  async registerTime(timeEntry) {
    try {
      await this.ensureAuthenticated();

      // Format data for Excel
      const rowData = [
        [
          timeEntry.date,
          timeEntry.consultant,
          timeEntry.client,
          timeEntry.project || '',
          parseFloat(timeEntry.hours) || 0,
          parseFloat(timeEntry.travelHours) || 0,
          timeEntry.description || '',
          new Date().toISOString()
        ]
      ];

      // Get the next empty row
      const nextRow = await this.findNextEmptyRow();
      const range = `Sheet1!A${nextRow}:H${nextRow}`;
      
      // Use workbook sessions API
      const session = await this.graphClient
        .api('/sites/valorino.sharepoint.com:/sites/ValoriCareAS:/drive/items/48E43E3E-77EF-4202-8A38-80BD9F773BAC/workbook/createSession')
        .post({});
        
      const response = await this.graphClient
        .api('/sites/valorino.sharepoint.com:/sites/ValoriCareAS:/drive/items/48E43E3E-77EF-4202-8A38-80BD9F773BAC/workbook/worksheets/Sheet1/range(address=\'' + range + '\')')
        .header('workbook-session-id', session.id)
        .patch({
          values: rowData
        });

      await this.graphClient
        .api('/sites/valorino.sharepoint.com:/sites/ValoriCareAS:/drive/items/48E43E3E-77EF-4202-8A38-80BD9F773BAC/workbook/closeSession')
        .post({});

      return true;

    } catch (error) {
      console.error('Error registering time in Excel:', error);
      throw new Error(`Excel registration failed: ${error.message}`);
    }
  }

  async findNextEmptyRow() {
    try {
      await this.ensureAuthenticated();

      const session = await this.graphClient
        .api('/sites/valorino.sharepoint.com:/sites/ValoriCareAS:/drive/items/48E43E3E-77EF-4202-8A38-80BD9F773BAC/workbook/createSession')
        .post({});

      const response = await this.graphClient
        .api('/sites/valorino.sharepoint.com:/sites/ValoriCareAS:/drive/items/48E43E3E-77EF-4202-8A38-80BD9F773BAC/workbook/worksheets/Sheet1/usedRange')
        .header('workbook-session-id', session.id)
        .get();

      await this.graphClient
        .api('/sites/valorino.sharepoint.com:/sites/ValoriCareAS:/drive/items/48E43E3E-77EF-4202-8A38-80BD9F773BAC/workbook/closeSession')
        .post({});

      if (!response || typeof response.rowCount !== 'number') {
        console.warn('Invalid response from usedRange:', response);
        return 2; // Start from row 2 if we can't determine the last row
      }

      return response.rowCount + 2; // Add 2 to account for header row and 0-based index
    } catch (error) {
      console.error('Error finding next empty row:', error);
      throw new Error(`Failed to find next empty row: ${error.message}`);
    }
  }
}

export const excelService = new ExcelService();