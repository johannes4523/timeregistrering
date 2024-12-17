class ExcelService {
  constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
    this.graphClient = null;
    this.isInitialized = false;
  }

  async login() {
    try {
      console.log('Starting login process...');
      const scopes = [
        'Files.ReadWrite',
        'Sites.ReadWrite.All',
        'User.Read',
        'Files.ReadWrite.All'
      ];

      // Sjekk om vi allerede har en aktiv sesjon
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        console.log('Found existing account:', accounts[0].username);
        await this.initializeGraphClient(accounts[0]);
        return true;
      }

      console.log('No existing session, attempting login...');
      const loginResponse = await this.msalInstance.loginPopup({ scopes });
      console.log('Login response:', loginResponse);
      
      await this.initializeGraphClient(loginResponse.account);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Detailed login error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async initializeGraphClient(account) {
    try {
      console.log('Initializing Graph client for account:', account.username);
      
      const tokenRequest = {
        scopes: [
          'Files.ReadWrite',
          'Sites.ReadWrite.All',
          'User.Read',
          'Files.ReadWrite.All'
        ],
        account: account
      };

      console.log('Requesting token with:', tokenRequest);
      const token = await this.msalInstance.acquireTokenSilent(tokenRequest);
      console.log('Token acquired successfully');

      this.graphClient = Client.init({
        authProvider: (done) => {
          done(null, token.accessToken);
        }
      });

      // Test Graph Client connection
      try {
        const testResponse = await this.graphClient.api('/me').get();
        console.log('Graph client test successful:', testResponse.displayName);
      } catch (graphError) {
        console.error('Graph client test failed:', graphError);
      }

    } catch (error) {
      console.error('Graph client initialization error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      if (error.name === 'InteractionRequiredAuthError') {
        console.log('Token expired, attempting re-login...');
        await this.login();
      } else {
        throw error;
      }
    }
  }

  async registerTime(timeEntry) {
    try {
      console.log('Starting time registration process...', timeEntry);

      // Sjekk autentisering
      if (!this.graphClient || !this.isInitialized) {
        console.log('No Graph client, attempting login...');
        await this.login();
      }

      // Test SharePoint-tilgang
      try {
        console.log('Testing SharePoint access...');
        const site = await this.graphClient
          .api('/sites/valorino.sharepoint.com:/sites/ValoriCareAS')
          .get();
        console.log('SharePoint site access successful:', site.displayName);
      } catch (siteError) {
        console.error('SharePoint access test failed:', siteError);
        throw new Error('Cannot access SharePoint site. Please check permissions.');
      }

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

      console.log('Formatted row data:', rowData);

      // Opprett ny Excel-sesjon
      console.log('Creating Excel session...');
      const session = await this.graphClient
        .api('/sites/valorino.sharepoint.com:/sites/ValoriCareAS:/drive/items/48E43E3E-77EF-4202-8A38-80BD9F773BAC/workbook/createSession')
        .post({});
      console.log('Excel session created:', session.id);

      // Finn neste ledige rad
      const nextRow = await this.findNextEmptyRow(session.id);
      console.log('Next empty row:', nextRow);

      // Skriv data til Excel
      const range = `Sheet1!A${nextRow}:H${nextRow}`;
      console.log('Writing to range:', range);
      
      const response = await this.graphClient
        .api('/sites/valorino.sharepoint.com:/sites/ValoriCareAS:/drive/items/48E43E3E-77EF-4202-8A38-80BD9F773BAC/workbook/worksheets/Sheet1/range(address=\'' + range + '\')')
        .header('workbook-session-id', session.id)
        .patch({
          values: rowData
        });

      console.log('Excel write response:', response);

      // Lukk sesjonen
      await this.graphClient
        .api('/sites/valorino.sharepoint.com:/sites/ValoriCareAS:/drive/items/48E43E3E-77EF-4202-8A38-80BD9F773BAC/workbook/closeSession')
        .post({});
      console.log('Excel session closed successfully');

      return true;

    } catch (error) {
      console.error('Detailed registration error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        timeEntry: timeEntry
      });
      throw new Error(`Excel registration failed: ${error.message}`);
    }
  }

  async findNextEmptyRow(sessionId) {
    try {
      console.log('Finding next empty row...');
      const response = await this.graphClient
        .api('/sites/valorino.sharepoint.com:/sites/ValoriCareAS:/drive/items/48E43E3E-77EF-4202-8A38-80BD9F773BAC/workbook/worksheets/Sheet1/usedRange')
        .header('workbook-session-id', sessionId)
        .get();

      console.log('Used range response:', response);

      if (!response || typeof response.rowCount !== 'number') {
        console.warn('Invalid response from usedRange:', response);
        return 2;
      }

      return response.rowCount + 2;
    } catch (error) {
      console.error('Error finding next empty row:', error);
      throw new Error(`Failed to find next empty row: ${error.message}`);
    }
  }
}

export const excelService = new ExcelService();