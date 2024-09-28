<script>
  import { goto } from "@roxi/routify";
  import { init, t } from "svelte-i18n";
  import appData from "$stores/app-data-store.js";
  import user from "$stores/user-store.js";
  import { isEmpty } from "$helpers/validation.js";
  import { sessionLogin } from "$helpers/auth.js";
  import Alert from "$components/common/Alert.svelte";
  import Button from "$components/common/Button.svelte";
  import TextInput from "$components/form/TextInput.svelte";
  import SelectInput from "$components/form/SelectInput.svelte";

  let email;
  let password;
  let language;
  let formDisabled = false;

  if ($appData.language) {
    language = $appData.language;
  } else {
    language = "en";
  }

  $: $appData.language = language;

  let languageItems = [
    {
      value: "en",
      text: $t("language.en"),
    },
    {
      value: "es",
      text: $t("language.es"),
    },
  ];

  function handleLogin() {
    let errors = [];
    if (isEmpty(email)) {
      errors.push($t("login.emailIsRequired"));
    }

    if (isEmpty(password)) {
      errors.push($t("login.passwordIsRequired"));
    }

    if (isEmpty(language)) {
      errors.push($t("login.languageIsRequired"));
    }

    if (errors.length > 0) {
      $appData.loginError = errors;
      return;
    }

    formDisabled = true;
    $appData.loginError = null;

    sessionLogin(email, password)
      .then(async (userData) => {
        $user = userData; // DO NOT TOUCH!!!
        $user.isLoggedIn = true;

        if (
          $user.userData &&
          $user.userData.extendedData &&
          $user.userData.extendedData.organizations &&
          $user.userData.extendedData.organizations.length > 0
        ) {
          if ($user.userData.extendedData.organizations.length === 1) {
            if (window.location.href.indexOf("/login") != -1) {
              $goto("/");
            } else {
              $goto(window.location.href);
            }
          }
        } else {
          throw new Error("An error occurred when requesting data. Please try again.");
        }
      })
      .catch((err) => {
        user.reset();
        $appData.loginError = err;
        formDisabled = false;
      });
  }

  function handleLanguageChanged() {
    init({
      fallbackLocale: "en",
      initialLocale: language,
    });
  }
</script>

<div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
  <div class="max-w-xl w-full space-y-4 bg-white p-12 rounded-3xl">
    <div>
      <img class="mx-auto w-auto h-auto" src="/Example-Logo-Horizontal-Dark.png" alt="Example Application" />
      <p class="mt-3 text-2xl text-center">{$t("login.title")}</p>
    </div>

    {#if $appData.loginError}
      <Alert messages={$appData.loginError} />
    {/if}

    <form on:submit|preventDefault={handleLogin}>
      <div class="space-y-3">
        <TextInput placeholder={$t("login.emailPlaceholder")} disabled={formDisabled} enterSubmit={true} bind:value={email} />
        <TextInput type="password" placeholder={$t("login.passwordPlaceholder")} disabled={formDisabled} enterSubmit={true} bind:value={password} />
        <SelectInput items={languageItems} disabled={formDisabled} on:change={handleLanguageChanged} bind:value={language} />
        <Button submit={true} disabled={formDisabled} block={true}>
          {!formDisabled ? $t("login.loginButton") : $t("login.loginButton.working")}
        </Button>
        <div class="text-sm text-center">
          {$t("login.supportText")}
        </div>
      </div>
    </form>
  </div>
</div>
