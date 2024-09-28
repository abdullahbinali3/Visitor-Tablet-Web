<script>
  import { url, goto } from "@roxi/routify";
  import { init, t } from "svelte-i18n";
  import appData from "$stores/app-data-store.js";
  import modals from "$stores/modals-store.js";
  import { isEmpty } from "$helpers/validation.js";
  import { parseResponse, throwOnFetchError } from "$helpers/parseResponse.js";

  import Alert from "$components/common/Alert.svelte";
  import Button from "$components/common/Button.svelte";
  import SelectInput from "$components/form/SelectInput.svelte";
  import TextInput from "$components/form/TextInput.svelte";
  import Modal from "$components/modal/Modal.svelte";
  import { sessionLogout } from "$helpers/auth.js";

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

  function handleLogout() {
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

    fetch(`${$appData.apiUrl}/auth/logoutJwtTablet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${$appData.authToken}`,
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(parseResponse)
      .then(async ([res, data]) => {
        if (res.status === 400) {
          // show error messages
          $appData.loginError = data.errorMessages;

          if (data.fatalError) {
            localStorage.removeItem("organizationId");
            localStorage.removeItem("deskId");
            localStorage.removeItem("floorId");
            localStorage.removeItem("buildingId");
            
            modals.showModal("error", [data.errorMessages]);

            // If fatal error, it means e.g. the desk was deleted. Redirect to desks list.
            $goto($url("/"));
          }
          return;
        }
        throwOnFetchError(res, data);

        sessionLogout();
        $goto("/login");
      })
      .catch((error) => {
        $appData.loginError = error;
      })
      .finally(() => {
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

<Modal containerClass="rounded-3xl" maxWidthClass="sm:max-w-xl" hideFooter={true} on:cancel disabled={formDisabled}
  ><div class="max-w-xl w-full space-y-4 p-8">
    <div>
      <img class="mx-auto w-auto h-auto" src="/Example-Logo-Horizontal-Dark.png" alt="Example Application" />
      <p class="mt-3 text-2xl text-center">{$t("login.title")}</p>
    </div>

    {#if $appData.loginError}
      <Alert messages={$appData.loginError} />
    {/if}

    <form on:submit|preventDefault={handleLogout}>
      <div class="space-y-3">
        <TextInput placeholder={$t("login.emailPlaceholder")} disabled={formDisabled} enterSubmit={true} bind:value={email} />
        <TextInput type="password" placeholder={$t("login.passwordPlaceholder")} disabled={formDisabled} enterSubmit={true} bind:value={password} />
        <SelectInput items={languageItems} disabled={formDisabled} on:change={handleLanguageChanged} bind:value={language} />
        <Button submit={true} disabled={formDisabled} block={true}>
          {!formDisabled ? $t("login.logoutButton") : $t("login.logoutButton.working")}
        </Button>
        <div class="text-sm text-center">
          {$t("login.supportText")}
        </div>
      </div>
    </form>
  </div>
</Modal>
