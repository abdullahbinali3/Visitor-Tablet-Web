<script>
  import { url, params, goto } from "@roxi/routify";
  import { t } from "svelte-i18n";
  import appData from "$stores/app-data-store.js";
  import user from "$stores/user-store.js";
  //import modals from "$stores/modals-store.js";
  import { parseResponse, throwOnFetchError } from "$helpers/parseResponse.js";
  import { guid_to_base64, base64_to_guid } from "$helpers/guid.js";

  import ButtonRounded from "$components/common/ButtonRounded.svelte";
  import Spinner from "$components/common/Spinner.svelte";
  import Alert from "$components/common/Alert.svelte";
  import PageLoadError from "$components/layout/PageLoadError.svelte";
  import BuildingList from "$components/system/BuildingList.svelte";
  import Panel from "$components/layout/Panel.svelte";
  import SspIconModal from "$components/system/SspIconModal.svelte";

  let organizationId = base64_to_guid($params.organizationId);

  if (organizationId === null) {
    // If organizationId on the url is invalid, and user is only assigned to one organization,
    // navigate to the next page automatically. Otherwise, redirect to the organization select page.
    if (
      $user.userData &&
      $user.userData.extendedData &&
      $user.userData.extendedData.organizations &&
      $user.userData.extendedData.organizations.length === 1
    ) {
      // Go to building/floor/desk selection page
      $goto("/test/:organizationId", { organizationId: guid_to_base64($user.userData.extendedData.organizations[0].id) });
    } else {
      // Go to organization selection page
      $goto("/");
    }
  }

  let buildingsList;
  let pageLoaded = null;
  let pageLoadedErrorMessage = null;
  let sspIconModalShown = false;

  let lastUid = localStorage.getItem("uid");
  let lastOrganizationId = localStorage.getItem("organizationId");
  let lastBuildingId = localStorage.getItem("buildingId");

  let showList = true;

  if (lastUid === $user.userData.uid && lastOrganizationId !== null && lastBuildingId !== null) {
    showList = false;
    $goto("/test/:organizationId/:buildingId", {
      organizationId: guid_to_base64(lastOrganizationId),
      buildingId: guid_to_base64(lastBuildingId),
    });
  } else {
    localStorage.removeItem("organizationId");
    localStorage.removeItem("buildingId");

    loadData();
  }

  function loadData() {
    if (organizationId === null) {
      return;
    }

    pageLoaded = null;
    pageLoadedErrorMessage = null;

    fetch(`${$appData.apiUrl}/visitorTablet/buildings/${encodeURIComponent(organizationId)}/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${$appData.authToken}`,
      },
    })
      .then(parseResponse)
      .then(([res, data]) => {
        /*
        if (res.status === 400) {
          // show error messages
          modals.showModal("error", [data.errorMessages]);
          return;
        }
        */
        throwOnFetchError(res, data);

        buildingsList = data;
        pageLoaded = "done";
      })
      .catch((error) => {
        pageLoaded = "error";
        pageLoadedErrorMessage = error;
      });
  }

  function handleChangeOrganization() {
    localStorage.removeItem("organizationId");
    localStorage.removeItem("buildingId");
    $goto("/");
  }
</script>

{#if showList}
  <div class="max-w-full mx-auto p-4 sm:p-6 lg:p-8">
    <Panel>
      <div class="pb-6 flex justify-between">
        <button
          on:click={() => {
            sspIconModalShown = true;
          }}
        >
          <img src={$url("/SSP-Logo-Full.png")} alt="Example Application" class="w-[4rem] h-[2.145rem]" />
        </button>
        {#if $user.userData.extendedData.organizations.length > 1}
          <ButtonRounded size="sm" on:click={handleChangeOrganization}>
            <span class="uppercase">{$t("main.selectOrganization")}</span>
          </ButtonRounded>
        {/if}
      </div>
      {#if pageLoaded === null}
        <Spinner />
      {:else if pageLoaded === "done"}
        <h1 class="text-3xl text-blacktext font-medium">
          {$t("buildingSelect.title")}
        </h1>
        <div class="mt-4 space-y-2">
          {#if buildingsList.length === 0}
            <Alert>{$t("buildingSelect.noBuildings")}</Alert>
          {:else}
            {#each buildingsList as building (building.id)}
              <div>
                <BuildingList {organizationId} {building} />
              </div>
            {/each}
          {/if}
        </div>
      {:else if pageLoaded === "error"}
        <PageLoadError reloadFunc={loadData} errorMessages={pageLoadedErrorMessage} />
      {/if}
    </Panel>
  </div>
{/if}

{#if sspIconModalShown}
  <SspIconModal on:cancel={() => (sspIconModalShown = false)} />
{/if}
