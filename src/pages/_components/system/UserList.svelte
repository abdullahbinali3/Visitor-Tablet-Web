<script>
  import { createEventDispatcher } from "svelte";
  import { multiSearchOr } from "$helpers/search.js";
  import { t } from "svelte-i18n";

  import SolidSearchIcon from "$icons/SolidSearchIcon.svelte";
  import MiniEnvelopeIcon from "$icons/MiniEnvelopeIcon.svelte";
  import OutlineArrowSmallRightIcon from "$icons/OutlineArrowSmallRightIcon.svelte";

  export let userList;
  export let excludeList = [];

  const dispatch = createEventDispatcher();

  let userListMinusExclusions = JSON.parse(JSON.stringify(userList)); // create deep copy
  let filteredUserList = userListMinusExclusions;
  let searchValue = "";

  for (let i = 0; i < excludeList.length; ++i) {
    for (let j = userListMinusExclusions.length - 1; j >= 0; --j) {
      if (userListMinusExclusions[j].uid == excludeList[i].uid) {
        userListMinusExclusions.splice(j, 1);
      }
    }
  }

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
    if (val === "") {
      filteredUserList = userListMinusExclusions;
      return;
    }

    let searchTerms = val.split(" ");

    if (searchTerms.length === 0) {
      return;
    }

    filteredUserList = userListMinusExclusions.filter((item) => {
      return (
        multiSearchOr(item.displayName, searchTerms) ||
        multiSearchOr(item.email, searchTerms)
      );
    });
  }

  function handleClick(user) {
    dispatch("click", user);
  }
</script>

<div class="relative w-full border ring-1 ring-black ring-opacity-5">
  <SolidSearchIcon
    className="pointer-events-none absolute top-3 left-4 h-8 w-8
text-gray-400" />
  <input
    type="text"
    bind:value={searchValue}
    on:keydown={handleSearchKeydown}
    on:input={handleSearchInput}
    class="h-12 w-full border-0 bg-transparent pl-[4rem] pr-4 text-gray-800
placeholder-gray-400 focus:ring-0 text-2xl mb-1"
    placeholder={$t("main.searchUsersNameOrEmail")} />
</div>
<div
  class="h-[17rem] overflow-y-scroll bg-white shadow ring-1 ring-black ring-opacity-5 rounded-b-md">
  <ul class="divide-y divide-gray-200">
    {#each filteredUserList as user, i (user.uid)}
      <li class="cursor-pointer" on:click={() => handleClick(user)}>
        <div class="block hover:bg-gray-100" class:bg-gray-50={i % 2 == 0}>
          <div class="flex items-center pr-4 py-2 sm:pr-6">
            <div
              class="flex min-w-0 flex-1 basis-full md:basis-2/5 items-center">
              <div class="min-w-0 px-4">
                <div>
                  <p class="truncate text-2xl font-medium">
                    {user.displayName}
                  </p>
                  <div class="block md:hidden">
                    <p class="flex items-center text-2xl text-gray-500">
                      <MiniEnvelopeIcon
                        className="mr-1.5 h-7 w-7 flex-shrink-0 text-gray-400" />
                      <span class="truncate">{user.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="md:flex min-w-0 flex-1 basis-3/5 items-center hidden">
              <div class="min-w-0 px-4">
                <div>
                  <p class="flex items-center text-2xl text-gray-500">
                    <MiniEnvelopeIcon
                      className="mr-1.5 h-7 w-7 flex-shrink-0 text-gray-400" />
                    <span class="truncate">{user.email}</span>
                  </p>
                </div>
              </div>
            </div>
            <div
              class="inline-flex items-center p-1.5 border rounded-full shadow-sm focus:outline-none text-white bg-primary border-transparent">
              <OutlineArrowSmallRightIcon classColor="text-white" />
            </div>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>
