<script>
  import { t } from "svelte-i18n";
  function goToCheckIn() {
      window.location.href = "/signin";
  }
</script>

<!-- Main Container -->
<div class="w-full h-screen bg-gray-100 mx-auto text-center pt-24 pb-24 relative">
 <!-- Welcome Heading -->
 <h1 class="text-4xl mt-10 mb-14 font-normal">{$t("Welcome")}</h1>

 <!-- Button Section -->
 <div class="flex justify-center gap-[190px] mb-7">
   <button class="bg-purple-600 text-white py-2 px-20 text-lg rounded-lg hover:bg-purple-700 transition duration-300" on:click={goToCheckIn}>{$t("SignIn")}</button>
   <button class="bg-purple-600 text-white py-2 px-20 text-lg rounded-lg hover:bg-purple-700 transition duration-300">{$t("SignOut")}</button>
 </div>

 <!-- Or Divider -->
 <div class="text-lg text-gray-500 my-4">________________________ {$t("or")} ________________________</div>

 <!-- Register Visitor Button -->
 <button class="bg-white text-purple-600 border-2 border-gray-300 w-1/2 py-4 text-lg rounded-xl mt-5 hover:bg-purple-600 hover:text-white transition duration-300">{$t("RegistorVisitor")}</button>

 <!-- QR Code Section -->
 <div class="absolute top-8 right-8">
   <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" class="w-36 h-36" />
 </div>
</div>
