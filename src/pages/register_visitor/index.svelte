<script>
  // Importing necessary components for form fields and buttons
  import InputText from "$components/form/TextInput.svelte";
  import SelectInput from "$components/form/SelectInput.svelte";
  import Button from "$components/common/Button.svelte";
  import DateInput from "$components/form/DateInput.svelte";
  import TimeInput from "$components/form/TimeInput.svelte";
  import { t } from "svelte-i18n";  // Importing translation function for multi-language support

  // Defining form input variables to store user input
  let location = '';
  let firstName = '';
  let surname = '';
  let email = '';
  let mobileNumber = '';
  let company = '';
  let purpose = '';
  let host = '';
  let startDate = '';
  let startTime = '';
  let endDate = '';
  let endTime = '';

  // Dropdown items for "Host" and "Location" selection fields
  const hostItems = ["Host 1", "Host 2"];
  const locationItems = ["Location 1", "Location 2"];

  // Function to handle form submission
  function handleSubmit(event) {
      event.preventDefault();  // Prevents the form from reloading the page on submit
      // Console logging the form data for now; you can replace this with actual form handling logic
      console.log({
          location,
          firstName,
          surname,
          email,
          mobileNumber,
          company,
          purpose,
          host,
          startDate,
          startTime,
          endDate,
          endTime
      });
  }

  // Function to handle the addition of another visitor (currently empty)
  function addAnotherVisitor() {
      // Logic to add another visitor (e.g., reset form or display a new form)
  }
</script>

<!-- Main container that centers the form and defines the layout -->
<div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
  
  <!-- Form wrapper with padding and styles -->
  <div class="max-w-3xl w-full min-h-[500px] sm:min-h-[400px] space-y-4 bg-white p-10 sm:p-12 lg:p-16 rounded-3xl relative">
      <!-- Form title -->
      <h1 class="text-2xl font-semibold text-center mb-6">{$t("registervisitor.title")}</h1>

      <!-- Start of the form section -->
      <form on:submit={handleSubmit}>

          <!-- Location Selector using SelectInput component -->
          <div class="mb-4">
              <label for="location" class="block mb-2 text-gray-600">{$t("registervisitor.visitoraccessLabel")}</label>
              <SelectInput items={locationItems} />
          </div>

          <!-- Name fields: First Name and Surname -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputText bind:value={firstName} placeholder={$t("registervisitor.firstnamePlaceholder")} enterSubmit={true} />
              <InputText bind:value={surname} placeholder={$t("registervisitor.surnamePlaceholder")} enterSubmit={true} />
          </div>

          <!-- Email and Mobile Number fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputText bind:value={email} placeholder={$t("login.emailPlaceholder")} enterSubmit={true} />
              <InputText bind:value={mobileNumber} placeholder={$t("registervisitor.mobilenumberPlaceholder")} enterSubmit={true} />
          </div>

          <!-- Company and Purpose fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputText bind:value={company} placeholder={$t("registervisitor.companyPlaceholder")} enterSubmit={true} />
              <InputText bind:value={purpose} placeholder={$t("registervisitor.purposePlaceholder")} enterSubmit={true} />
          </div>

          <!-- Host Selection using SelectInput component -->
          <div class="mb-4">
              <label for="host" class="block mb-2 text-gray-600">{$t("registervisitor.selecthostLabel")}</label>
              <SelectInput items={hostItems} />
          </div>

          <!-- Date and Time fields using DateInput and TimeInput components -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <DateInput label={$t("startDate")} bindValue={startDate} />
              <TimeInput label={$t("startTime")} bindValue={startTime} />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <DateInput label={$t("endDate")} bindValue={endDate} />
              <TimeInput label={$t("endTime")} bindValue={endTime} />
          </div>

          <!-- Button to add another visitor (currently not functional) -->
          <div class="flex justify-center">
              <Button className="w-full sm:w-auto py-3 sm:py-4 text-lg mt-5" on:click={addAnotherVisitor}>
                  {$t("registervisitor.addanothervisitorButton")}
              </Button>
          </div>

          <!-- Submit button for form submission -->
          <div class="flex justify-center">
              <Button className="w-full sm:w-auto py-3 sm:py-4 text-lg mt-5">
                  {$t("submit.submitButton")}
              </Button>
          </div>

          <!-- Sign In / Sign Out option at the bottom -->
          <div class="flex justify-center">
              <Button type="simple" className="w-full sm:w-auto py-3 sm:py-4 text-lg mt-5">
                  {$t("signin/signout.signin/signoutButton")}
              </Button>
          </div>
          
      </form>
  </div>
</div>
