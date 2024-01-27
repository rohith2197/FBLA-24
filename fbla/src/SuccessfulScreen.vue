<!-- src/SuccessfulScreen.vue -->

<template>
  <div class="success-screen">
    <img src="@/assets/background.png" alt="Background" class="background" />
    <div class="home-text">Home Screen</div>
    <div class="title-info">Individual Companies</div>
    <hr class="line-under-home" />
    <hr class="line-under-ind" />
    <button @click="exportToExcel" class="export-button">Export</button>
    <button @click="toggleHelpPopup" class="question-button">Help</button>
    <!-- Help Popup -->
    <div v-if="showHelpPopup" class="help-popup">
      <h2>Help Information</h2>
      <!-- Add your help content here -->
    <p>This is the help content. Replace it with your actual help informat  ion.</p>
    <button @click="toggleHelpPopup" class = "endhelp">Close</button>
</div>

    <input v-model="searchInput" placeholder="Search by Company Name" class="search-bar" />
    <div class="chart-container">
      <canvas ref="fundingChart"></canvas>
    </div>
    <!-- New Scroll-down Section -->
    <div class="scroll-down-section">
        <div v-for="company in filteredFundingData" :key="company.label" class="company-info" @click="toggleCompanyDetails(company)">
          <h2>{{ company.label }}</h2>
          <div v-if="!company.showDetails">
            <label>Funding Amount:</label> <p>${{ company.value }}</p>
          </div>
          <div v-else>
            <!-- Show full details when expanded -->
            <label>Funding Amount:</label> <p>${{ company.value }}</p>
            <label>Organization Type:</label> <p>{{ company.org_type }}</p>
            <label>Resources:</label> <p>{{ company.resources }}</p>
            <label>Contact Email:</label> <p>{{ company.contact_email }}</p>
            <label>Company Website:</label> <p>{{ company.company_website }}</p>
            <label>Company Summary:</label> <p>{{ company.company_summary }}</p>
            <label>Products:</label> <p>{{ company.products }}</p>

            <button @click="removeCompany(company)" class="delete-button">
              <img src="/Users/rohithpallamreddy/Documents/GitHub/FBLA-24/fbla/src/assets/trash-can.png" alt="Delete" style="width: 30px; height: 30px;" />
            </button>
          </div>
          <button v-if="company.showDetails" @click.stop="editCompany(company)" class="edit-button">
            <img src="/Users/rohithpallamreddy/Documents/GitHub/FBLA-24/fbla/src/assets/pencil-icon-transparent-free-png.png" alt="Edit" style="width: 46px; height: 45px;" />
          </button>
        </div>
          <!-- New Widget for Adding a Company -->
        <div class="add-company-widget" @click="toggleAddCompanyPopup">
          <span>+</span>
        </div>

        <!-- Add Company Popup -->
        <div v-if="showAddCompanyPopup" class="add-company-popup">
          <h2>{{ editingCompany ? 'Edit' : 'Add New' }} Company</h2>
           <label>Company Name:</label> <input v-model="newCompany.name" />

          <!-- <label>Funding Amount:</label> <input v-model="newCompany.fundingAmount" type="number" /> -->
          <label>Funding Amount:</label>
          <input v-model="newCompany.fundingAmount" type="number" :class="{ 'error': !isNumeric(newCompany.fundingAmount) }" />
          <p v-if="!isNumeric(newCompany.fundingAmount)" class="error-message">Funding amount must be a number</p>

          <label>Organization Type:</label> <input v-model="newCompany.org_type" />
          <label>Resources:</label> <input v-model="newCompany.resources" />
          <label>Contact Email:</label>
          <input v-model="newCompany.contact_email" :class="{ 'error': contact_email_error }" />
          <p v-if="contact_email_error" class="error-message">{{ contact_email_error_message }}</p>
          <label>Company Website:</label>
          <input v-model="newCompany.company_website" :class="{ 'error': company_website_error }" />
          <p v-if="company_website_error" class="error-message">{{ company_website_error_message }}</p>
          <label>Company Summary:</label> <input v-model="newCompany.company_summary" />
          <label>Products:</label> <input v-model="newCompany.products" />
          <!-- ... other input fields ... -->
          <button @click="editingCompany ? updateCompany() : addNewCompany()">
            {{ editingCompany ? 'Update' : 'Add' }} Company
          </button>
          <button @click="cancelAddCompany">Cancel</button>
        </div>
     </div>
  </div>
</template>


<script>
import axios from 'axios';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      username: '',
      password: '',
      inputText: '',
      fundingData: [],
      searchInput: '',
      showAddCompanyPopup: false,
      newCompany: {
        name: '',
        fundingAmount: 0,
        // ... other properties ...
      },
      contact_email_error: false,
      contact_email_error_message: '',
      company_website_error: false,
      company_website_error_message: '',
      showHelpPopup: false,
    };
  },
  computed: {
    filteredFundingData() {
  // Filter companies based on the search input
  const searchLower = this.searchInput.toLowerCase();
  return this.fundingData.filter(company =>
    (company.label?.toLowerCase() || '').includes(searchLower)
  );
},

  },
  methods: {
    toggleHelpPopup() {
      this.showHelpPopup = !this.showHelpPopup;
    },
    editCompany(company) {
    // Set the editingCompany flag to true
    this.editingCompany = true;

    // Copy the details of the selected company to the newCompany object
    this.newCompany = {
      name: company.label,
      fundingAmount: company.value,
      org_type: company.org_type || '',
      resources: company.resources || '',
      contact_email: company.contact_email || '',
      company_website: company.company_website || '',
      company_summary: company.company_summary || '',
      products: company.products || '',
    };

    // Open the add company popup
    this.showAddCompanyPopup = true;
  },

  updateCompany() {

    if (this.newCompany.contact_email && !this.isValidEmailFormat(this.newCompany.contact_email)) {
    this.contact_email_error = true;
    this.contact_email_error_message = 'Please enter a valid email address';
    return;
  } else {
    this.contact_email_error = false;
    this.contact_email_error_message = '';
  }

  // Validate website format
  if (this.newCompany.company_website && !this.isValidWebsiteFormat(this.newCompany.company_website)) {
    this.company_website_error = true;
    this.company_website_error_message = 'Please enter a valid website address';
    return;
  } else {
    this.company_website_error = false;
    this.company_website_error_message = '';
  }

    // Find and update the existing company in the fundingData array
    const index = this.fundingData.findIndex(c => c.label === this.newCompany.name);
    if (index !== -1) {
      this.fundingData[index] = {
        label: this.newCompany.name,
        value: parseFloat(this.newCompany.fundingAmount),
        org_type: this.newCompany.org_type || '',
        resources: this.newCompany.resources || '',
        contact_email: this.newCompany.contact_email || '',
        company_website: this.newCompany.company_website || '',
        company_summary: this.newCompany.company_summary || '',
        products: this.newCompany.products || '',
        showDetails: false, // Reset showDetails flag
      };
    }

    // Save the updated dataset to the JSON file
    this.saveFundingData();

    // Reset the newCompany object and hide the popup
    this.newCompany = {
      name: '',
      fundingAmount: 0,
      org_type: '',
      resources: '',
      contact_email: '',
      company_website: '',
      company_summary: '',
      products: '',
    };
    this.showAddCompanyPopup = false;
    this.editingCompany = false;
  },

  // Add a method to save the updated dataset to the JSON file
  saveFundingData() {
    axios
      .post('/src/data.json', this.fundingData)
      .then(() => {
        console.log('Company data updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating JSON file:', error);
      });
  },
    removeCompany(company) {
    const index = this.fundingData.findIndex(c => c.label === company.label);
    if (index !== -1) {
      this.fundingData.splice(index, 1);

      // Save the updated dataset to the JSON file
      axios
        .post('/src/data.json', this.fundingData)
        .then(() => {
          console.log('Company removed successfully.');
        })
        .catch((error) => {
          console.error('Error updating JSON file:', error);
        });
    }
  },
    toggleAddCompanyPopup() {
      this.showAddCompanyPopup = !this.showAddCompanyPopup;
    },

    cancelAddCompany() {
    // Use an arrow function to retain the correct 'this' context
    this.showAddCompanyPopup = false;
  },

    isNumeric(value) {
      return /^\d+$/.test(value);
    },

    addNewCompany() {
  // Check if the required fields are not empty and fundingAmount is a valid number
      if (!this.newCompany.name || !this.isNumeric(this.newCompany.fundingAmount)) {
        console.error('Company name and funding amount are required.');
        return;
      }

      // Validate email format
      if (this.newCompany.contact_email && !this.isValidEmailFormat(this.newCompany.contact_email)) {
        this.contact_email_error = true;
        this.contact_email_error_message = 'Please enter a valid email address';
        return;
      } else {
        this.contact_email_error = false;
        this.contact_email_error_message = '';
      }

      // Validate website format
      if (this.newCompany.company_website && !this.isValidWebsiteFormat(this.newCompany.company_website)) {
        this.company_website_error = true;
        this.company_website_error_message = 'Please enter a valid website address';
        return;
      } else {
        this.company_website_error = false;
        this.company_website_error_message = '';
      }

  // Logic to add the new company to the dataset
  // Include all properties in the new company object
  this.fundingData.push({
    label: this.newCompany.name,
    value: parseFloat(this.newCompany.fundingAmount),
    org_type: this.newCompany.org_type || '',
    resources: this.newCompany.resources || '',
    contact_email: this.newCompany.contact_email || '',
    company_website: this.newCompany.company_website || '',
    company_summary: this.newCompany.company_summary || '',
    products: this.newCompany.products || '',
  });

  // Save the updated dataset to the JSON file
  axios
    .post('/src/data.json', this.fundingData)
    .then(() => {
      console.log('New company added successfully.');
    })
    .catch((error) => {
      console.error('Error updating JSON file:', error);
    });

  // Reset the newCompany object and hide the popup
  this.newCompany = {
    name: '',
    fundingAmount: 0,
    org_type: '',
    resources: '',
    contact_email: '',
    company_website: '',
    company_summary: '',
    products: '',
  };
  this.showAddCompanyPopup = false;
},
isValidEmailFormat(email) {
    return email.endsWith('.com');
  },

  isValidWebsiteFormat(website) {
    return website.endsWith('.com') || website.endsWith('.org');
  },

    toggleCompanyDetails(company) {
      // Toggle the showDetails property for the selected company
      company.showDetails = !company.showDetails;
    },
    async prepareChartData() {
      try {
        const response = await axios.get("/src/data.json");

        if (!response.data) {
          throw new Error('Invalid JSON data structure');
        }

        const jsonData = response.data;
        this.fundingData = jsonData.map(company => ({
          label: company.company_name,
          value: company.funding_amount,
          org_type: company.org_type,
          resources: company.resources,
          contact_email: company.contact_email,
          company_website: company.company_website,
          company_summary: company.company_summary,
          products: company.products,
        }));


        this.createChart();
      } catch (error) {
        console.error('Error fetching or parsing JSON file:', error);
      }
    },
    createChart() {
      const ctx = this.$refs.fundingChart.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.fundingData.map(company => company.label),
          datasets: [{
            label: 'Funding Amount',
            data: this.fundingData.map(company => company.value),
            backgroundColor: 'black', // Orange bars
            borderColor: 'gold',
            borderWidth: 2.5,
          }],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                  display: true,
                  text: 'Funding Amount',
                  color: 'black', // Black text color
                },
              ticks: {
                stepSize: 2000, // Adjust as needed for a skinnier y-axis
                color: 'black',
                fontWeight: 1000, // Bold font weight for y-axis ticks
              },
            },
            x: {
              ticks: {
                color: 'black', // Black text color for x-axis ticks
                fontWeight: 'bold', // Bold font weight for y-axis ticks
              },
            },
          },
        },
      });
    },
  },
  mounted() {
    this.prepareChartData();
  },
};
</script>

<style>
body {
  font-family: 'Rubik', sans-serif;
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: visible;
}


.background {
  position: fixed; /* Fixed position to make it move with the scroll */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1; /* Move the background behind other elements */
}
.home-text {
  position: absolute;
  top: 1%;
  left: 2%;
  /* transform: translate(-50%, -50%);   */
  /* background-color: #ffffff; White background color */
  padding: 0%; /* Add padding as needed */
  /* background-image: url('~@/assets/background.png'); Set the background image */
  /* background-size: cover; Ensure the background image covers the entire container */
  /* Add other styles as needed */
  font-family: 'Rubik', sans-serif; /* Use Rubik font */
  font-weight: 501;
  font-size: 3em;
  z-index: 6;
}
.title-info {
  position: absolute;
  top: 90%;
  left: 2%;
  /* transform: translate(-50%, -50%);   */
  /* background-color: #ffffff; White background color */
  padding: 0%; /* Add padding as needed */
  /* background-image: url('~@/assets/background.png'); Set the background image */
  /* background-size: cover; Ensure the background image covers the entire container */
  /* Add other styles as needed */
  font-family: 'Rubik', sans-serif; /* Use Rubik font */
  font-weight: 501;
  font-size: 3em;
  z-index: 6;
}
.line-under-home {
  position: absolute;
  top: 96.5%; /* Adjust the top position as needed */
  left: 1%;
  width: 98%; /* Adjust the width as needed */
  border: 3px solid #000000; /* Adjust the border properties as needed */
  border-radius: 50px;
  z-index: 6; /* Adjust the z-index as needed */
}
.line-under-ind {
  position: absolute;
  top: 7%; /* Adjust the top position as needed */
  left: 1%;
  width: 98%; /* Adjust the width as needed */
  border: 3px solid #000000; /* Adjust the border properties as needed */
  border-radius: 50px;
  z-index: 6; /* Adjust the z-index as needed */
}
.export-button {
  position: absolute;
  top: 1.4%;
  right: 11%;
  padding: 0.5em 2em;
  font-size: 1.2em;
  font-family: 'Rubik', sans-serif; /* Use Rubik font */
  font-weight: 501;
  background-color: #bd963b; /* Blue background color */
  color: #000; /* White text color */
  border: 4px solid #000;;
  border-radius: 15px;
  cursor: pointer;
  z-index: 6;
}
.export-button:hover {
  background-color: #a57a15; /* Change background color on hover */
  /* transform: scale(0.95); */
}

.export-button:active {
  background-color: #a57a15; /* Change background color when button is clicked */
  transform: scale(0.97); /*Apply a shrink effect*/
  /* animation: shake 0.3s ease; */
}

.question-button {
  position: absolute;
  top: 1.4%;
  right: 2%; /* Adjust the right position as needed */
  padding: 0.5em 2em;
  font-size: 1.2em;
  font-family: 'Rubik', sans-serif; /* Use Rubik font */
  font-weight: 501;
  background-color: #000; /* Grey background color */
  color: #bd963b; /* White text color */
  border: 4px solid #bd963b;;
  border-radius: 15px;
  cursor: pointer;
  z-index: 6;
}

.question-button:hover {
  background-color: #333; /* Change background color on hover */
}

.chart-container {
  position: absolute;
  top: 25%;
  left:16%;
  width: 80%;
  height: 60%;
}

.scroll-down-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  justify-content: space-around;
  overflow-y: auto;
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
}

  .company-info {
    margin-bottom: 0px;
    padding: 10px;
    border: 5px solid #000; /* Add borders for better visibility */
    border-radius: 50px;
    background-color: lightgrey;
  }

  .company-info label {
  font-weight: bold;
}

.company-info {
    margin-bottom: 0px;
    padding: 10px;
    border: 5px solid #000;
    border-radius: 50px;
    background-color: lightgrey;
    cursor: pointer;
  }

  .company-info label {
    font-weight: bold;
  }

  .company-info h2 {
    margin-bottom: 5px;
    text-decoration: underline; /* Add underline to company names */
  }

.search-bar {
  margin-top: 860px;
  padding: 5px;
  margin-left: 2.5%;
  font-size: 1em;
  width: 95%; /* Adjust the width as needed */
  border: 2px solid #000;
  border-radius: 5px;
}
.no-results-message {
  font-size: 1.5em; /* Adjust the font size as needed */
  font-weight: 550; /* Make the text bold */
  margin-left: 25px;
  color: black; /* Adjust the color as needed */
  margin-top: 0px; /* Add margin space at the top */
  margin-bottom: 15px;
}

.add-company-widget {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 330px; /* Adjust the width as needed */
  height: 100px;
  border: 5px dashed #000;
  border-radius: 20px;
  font-size: 2em;
  cursor: pointer;
  margin: 10px; /* Adjust margin as needed */
  z-index: 6;
}

.add-company-widget span {
  font-weight: bold;
  z-index: 6;
}

.add-company-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 2px solid #000;
  border-radius: 10px;
  z-index: 8;
  width: 20%;
  /* color: #eee; */
}

.add-company-popup h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
  z-index: 6;
}

.add-company-popup label {
  margin-top: 10px;
  display: block;
  z-index: 6;
}

.add-company-popup input {
  margin-top: 5px;
  width: 100%;
  z-index: 6;
}

.add-company-popup button {
  margin-top: 10px;
  padding: 5px 10px;
  cursor: pointer;
  z-index: 6;
}
.error {
  border: 2px solid red;
}

.error-message {
  color: red;
  margin-top: 5px;
}

.company-info {
  position: relative; /* Ensure relative positioning for child absolute positioning */
  margin-bottom: 0px;
  padding: 10px;
  border: 5px solid #000;
  border-radius: 50px;
  background-color: lightgrey;
  cursor: pointer;
}
.company-info button.delete-button {
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: red;
  border-radius: 10px;
  color: white;
  border: 3px solid black; /* Add a black border */
  padding: 8px 10px;
  cursor: pointer;
}
.company-info button.delete-button:hover {
  background-color: #a40000; /* Change background color on hover */
}

.company-info button.edit-button {
  position: absolute;
  top: 60px; /* Adjust the top position as needed */
  right: 0px;
  background-color: #fff; /* Green background color for the "Edit" button */
  border-radius: 10px;
  color: black;
  border: 3px solid black; /* Add a black border */
  padding: 0px 2px;
  cursor: pointer;
}

.company-info button.edit-button:hover {
  background-color: #bbb; /* Change background color on hover */
}

.help-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #d3f0ff;
  padding: 20px;
  border: 2px solid #000;
  border-radius: 10px;
  z-index: 9; /* Set a higher z-index to ensure it appears above other elements */
  width: 70%; /* Adjust the width as needed */
  height: 60%;

}

.help-popup h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
  z-index: 10;
}

.help-popup p {
  margin-bottom: 10px;
  z-index: 10;
}

.help-popup button {
  padding: 5px 10px;
  cursor: pointer;
  z-index: 10;
}

.endhelp {
  size: 1.5em;
  border: none; /* Remove border */
  background-color: #ccc; /* Light grey background */
  color: black; /* Black text color */
  padding: 5px 10px; /* Adjust padding as needed */
  cursor: pointer;
  font-size: 0.7em;
  /* font-weight: 5001; */  
  z-index: 10;
  border-radius: 20px;
  /* border-width: 3px; */
  border: 1px solid #000;
}

</style>