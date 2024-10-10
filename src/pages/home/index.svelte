<script>
  import { goto } from "@roxi/routify";
  import { t } from "svelte-i18n";
  import user from "$stores/user-store.js";
  import { multiSearchOr } from "$helpers/search.js";
  import { buildImageUrl } from "$helpers/formatters.js";
  import { guid_to_base64 } from "$helpers/guid.js";

  import SolidSearchIcon from "$icons/SolidSearchIcon.svelte";
  import OutlineArrowSmallRightIcon from "$icons/OutlineArrowSmallRightIcon.svelte";

  let filteredOrganizations = [];

  let lastUid = localStorage.getItem("uid");
  let lastOrganizationId = localStorage.getItem("organizationId");
  let lastBuildingId = localStorage.getItem("buildingId");

  let showList = true;

  if (lastUid === $user.userData.uid && lastOrganizationId !== null && lastBuildingId !== null) {
    showList = false;
    $goto("/home/:organizationId/:buildingId", {
      organizationId: guid_to_base64(lastOrganizationId),
      buildingId: guid_to_base64(lastBuildingId),
    });
  } else {
    localStorage.removeItem("organizationId");
    localStorage.removeItem("buildingId");
  }

  let searchValue = "";

  function handleSearchKeydown(e) {
    let key = e.keyCode;
    switch (key) {
      case 27: // escape
        e.preventDefault();
        searchValue = "";
        updateSearch("");
        return;
    }
  }

  function handleSearchInput(e) {
    updateSearch(e.target.value);
  }

  function updateSearch(val) {
    if (!$user.userData || !$user.userData.extendedData || !$user.userData.extendedData.organizations) {
      filteredOrganizations = [];
      return;
    }
    if (val === "") {
      filteredOrganizations = $user.userData.extendedData.organizations;
      return;
    }

    let searchTerms = val.split(" ");

    if (searchTerms.length === 0) {
      return;
    }

    filteredOrganizations = $user.userData.extendedData.organizations.filter((item) => {
      return multiSearchOr(item.name, searchTerms);
    });
  }

  function handleClick(organizationId) {
    if (organizationId === null) {
      return;
    }
    $goto("/home/:organizationId", { organizationId: guid_to_base64(organizationId) });
  }

  // If user is only assigned to one organization, navigate to the next page automatically.
  $: if (
    showList &&
    $user.userData &&
    $user.userData.extendedData &&
    $user.userData.extendedData.organizations &&
    $user.userData.extendedData.organizations.length === 1
  ) {
    handleClick($user.userData.extendedData.organizations[0].id);
  }

  if (showList) {
    updateSearch("");
  }
</script>

{#if showList && $user.userData && $user.userData.extendedData && $user.userData.extendedData.organizations && $user.userData.extendedData.organizations.length > 1}
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
    <div class="max-w-4xl w-full space-y-4 bg-white p-12 rounded-3xl">
      <div>
        <img class="mx-auto w-auto h-auto" src="/Example-Logo-Horizontal-Dark.png" alt="Example Application" />
        <p class="mt-3 text-2xl text-center">{$t("login.title")}</p>
      </div>

      <div class="text-blacktext" style="font-size: 2rem;">
        {$t("main.selectOrganization")}
      </div>
      <div class="mt-4 relative w-full border ring-1 ring-black ring-opacity-5">
        <SolidSearchIcon className="pointer-events-none absolute top-3 left-4 h-8 w-8 text-gray-400" />
        <input
          type="text"
          bind:value={searchValue}
          on:keydown={handleSearchKeydown}
          on:input={handleSearchInput}
          class="h-12 w-full border-0 bg-transparent pl-[4rem] pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 text-2xl mb-1"
          placeholder={$t("main.searchOrganizationsName")}
        />
      </div>
      <div class="h-[17rem] overflow-y-scroll bg-white shadow ring-1 ring-black ring-opacity-5 rounded-b-md">
        <ul class="divide-y divide-gray-200">
          {#each filteredOrganizations as organization, i (organization.id)}
            <li class="cursor-pointer" on:click={() => handleClick(organization.id)}>
              <div class="block hover:bg-gray-100" class:bg-gray-50={i % 2 == 0}>
                <div class="flex items-center pr-4 py-2 sm:pr-6">
                  <div class="flex min-w-0 flex-1 basis-full md:basis-2/5 items-center">
                    <div class="min-w-0 px-4">
                      <div>
                        <p class="truncate text-2xl font-medium">
                          {organization.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="md:flex min-w-0 flex-1 basis-3/5 items-center hidden">
                    <div class="min-w-0 px-4">
                      <div>
                        <p class="flex items-center text-2xl text-gray-500">
                          <img class="max-h-6" alt={organization.name} src={buildImageUrl(organization.logoImageUrl)} />
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    class="inline-flex items-center p-1.5 border rounded-full shadow-sm focus:outline-none text-white bg-primary border-transparent"
                  >
                    <OutlineArrowSmallRightIcon classColor="text-white" />
                  </div>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
{/if}
