<script>
  import { createEventDispatcher } from "svelte";
  import { t } from "svelte-i18n";
  import user from "$stores/user-store.js";
  import { multiSearchOr } from "$helpers/search.js";
  import { buildImageUrl } from "$helpers/formatters.js";

  import Modal from "$components/modal/Modal.svelte";
  import SolidSearchIcon from "$icons/SolidSearchIcon.svelte";
  import OutlineArrowSmallRightIcon from "$icons/OutlineArrowSmallRightIcon.svelte";

  const dispatch = createEventDispatcher();

  let filteredOrganizations = [];

  let searchValue = "";

  updateSearch("");

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
    if (!$user || !$user.userData || !$user.userData.extendedData || !$user.userData.extendedData.organizations) {
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
    dispatch("select", { organizationId });
  }
</script>

<Modal containerClass="rounded-3xl" maxWidthClass="sm:max-w-6xl" hideFooter={true}>
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
      class="h-12 w-full border-0 bg-transparent pl-[4rem] pr-4 text-gray-800
  placeholder-gray-400 focus:ring-0 text-2xl mb-1"
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
              <div class="inline-flex items-center p-1.5 border rounded-full shadow-sm focus:outline-none text-white bg-primary border-transparent">
                <OutlineArrowSmallRightIcon classColor="text-white" />
              </div>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</Modal>
