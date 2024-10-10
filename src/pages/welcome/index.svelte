<script>
   import { t } from "svelte-i18n";
function goToCheckIn() {
    window.location.href = "/checkIn";
  }
</script>

<!-- Main Container -->
<div class="container">
  <!-- Welcome Heading -->
  <h1 class="welcome-text">{$t("Welcome")}</h1>

  <!-- Button Section -->
  <div class="button-group">
      <button class="btn primary" on:click={goToCheckIn}>{$t("SignIn")}</button>
  
    <button class="btn primary">{$t("SignOut")}</button>
  </div>

  <!-- Or Divider -->
  <div class="separator">________________________ {$t("or")} ________________________</div>

  <!-- Register Visitor Button -->
  <button class="btn register">{$t("RegistorVisitor")}</button>

  <!-- QR Code Section -->
  <div class="qr-code">
    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" />
  </div>
</div>

<style>
  /* Container styling to center the page */
  .container {
    width: 100%;
    height: 100vh;
    background-color: #f9f9f9;
    margin: 0 auto;
    text-align: center;
    padding-top: 100px;
    padding-bottom: 100px;
    position: relative;
  }

  /* Welcome Text */
  .welcome-text {
    font-size: 4rem;
    margin-top: 40px;
    /* color: #555; */
    margin-bottom: 60px;
    font-weight: 400;
  }

  /* Button Group Styling */
  .button-group {
    display: flex;
    justify-content: center;
    gap: 190px;
    margin-bottom: 30px;
  }

  /* Primary Button (Sign In/Sign Out) */
  .btn {
    padding: 7px 80px;
    font-size: 1.5rem;
    border-radius: 15px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn.primary {
    background-color: #6a29f5;
    color: #fff;
  }

  .btn.primary:hover {
    background-color: #5a22d4;
  }

  /* Register Button (full width) */
  .btn.register {
    background-color: #fff;
    color: #6a29f5;
    border: 2px solid #ccc;
    width: 50%;
    padding: 15px;
    font-size: 1.2rem;
    margin-top: 20px;
    border-radius: 20px;
  }

  .btn.register:hover {
    background-color: #6a29f5;
    color: white;
  }

  /* Or Separator */
  .separator {
    font-size: 1.2rem;
    color: #999;
    margin: 10px 0;
  }

  /* QR Code Styling */
  .qr-code {
    position: absolute;
    top: 30px;
    right: 30px;
  }

  .qr-code img {
    width: 150px;
    height: 150px;
  }
  
</style>
