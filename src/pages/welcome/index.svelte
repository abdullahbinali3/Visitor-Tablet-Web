<script>
  import { t } from "svelte-i18n";
  import Button from "$components/common/Button.svelte";
  import Divider from "$components/common/Divider.svelte";
  // function route to sign-in
  function goToSignIn() {
      window.location.href = "/signin";
  }
</script>

<!-- Main Container -->
<div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
  <!-- Content Container (with relative positioning) -->
  <div class="max-w-3xl w-full min-h-[500px] sm:min-h-[400px] space-y-4 bg-white p-10 sm:p-12 lg:p-16 rounded-3xl relative">
 
    <!-- QR Code positioned in the upper right corner -->
    <div class="absolute top-right sm:top-1 sm:right-1">
      <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" class="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28" />
    </div>

    <!-- Welcome Heading -->
    <h1 class="text-2xl text-center sm:text-3xl lg:text-4xl mt-6 mb-10 font-normal">{$t("title.welcome")}</h1>

    <!-- Button Section -->
    <div class="flex flex-col sm:flex-row sm:justify-center sm:gap-10 lg:gap-[190px] mb-8">
      <!-- Sign In Button -->
      <Button type="primary" on:click={goToSignIn} class="w-full sm:w-auto text-lg py-2 px-10 sm:px-16 lg:px-20 mb-4 sm:mb-0">
        {$t("signin.signinButton")}
      </Button>
      
      <!-- Sign Out Button -->
      <Button type="primary" class="w-full sm:w-auto text-lg py-2 px-10 sm:px-16 lg:px-20">
        {$t("signout.signoutButton")}
      </Button>
    </div>

    <!-- Or Divider -->
    <Divider />
    
    <!-- Register Visitor Button -->
    <div class="flex justify-center">
      <Button type="simple" class="w-full sm:w-auto py-3 sm:py-4 text-lg mt-5">
        {$t("welcome.registerButton")}
      </Button>
    </div>
  </div>
</div>
