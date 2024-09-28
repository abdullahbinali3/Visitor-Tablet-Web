<script>
  import { createEventDispatcher } from "svelte";
  import { t } from "svelte-i18n";
  import { parseApiErrorParameter } from "$helpers/validation.js";
  import Modal from "$components/modal/Modal.svelte";
  import MiniCheckIcon from "$components/heroicons/MiniCheckIcon.svelte";
  import MiniExclamationTriangleIcon from "$components/heroicons/MiniExclamationTriangleIcon.svelte";
  import MiniInformationCircleicon from "$components/heroicons/MiniInformationCircleIcon.svelte";
  import Button from "$components/common/Button.svelte";

  export let messages = [];
  export let icon;
  export let title = null;
  export let pre = true;
  export let maxWidthClass;
  export let closeText = $t("close");

  const dispatch = createEventDispatcher();

  let json;
  let jsonObjectEntries;
  let multipleJsonEntries = false;

  $: try {
    let messagesToParse = messages;
    if (messages instanceof Error) {
      messagesToParse = messages.message;
    }
    if (Object.prototype.toString.call(messagesToParse) === "[object Object]") {
      json = messagesToParse;
    } else if (typeof messagesToParse === "string") {
      json = JSON.parse(messagesToParse);
    } else if (Array.isArray(messagesToParse) && messagesToParse.length === 1) {
      if (typeof messagesToParse[0] === "object" && !Array.isArray(messagesToParse[0]) && messagesToParse[0] !== null) {
        json = messagesToParse[0];
      }
    }
    jsonObjectEntries = Object.entries(json);

    if (jsonObjectEntries.length > 1) {
      multipleJsonEntries = true;
    } else if (jsonObjectEntries.length == 1 && jsonObjectEntries[0][1].length > 1) {
      multipleJsonEntries = true;
    } else {
      multipleJsonEntries = false;
    }
  } catch {
    json = null;
    jsonObjectEntries = null;
  }

  function closeModal() {
    dispatch("cancel");
  }
</script>

<Modal on:cancel zIndexClass="z-[1001]" {maxWidthClass}>
  {#if icon === "success"}
    <div
      class="mx-auto flex items-center justify-center h-12 w-12 rounded-full
        bg-green-100 dark:bg-green-500/90"
    >
      <MiniCheckIcon className="text-green-600 dark:text-green-50" />
    </div>
  {:else if icon === "error" || icon === "danger"}
    <div
      class="mx-auto flex items-center justify-center h-12 w-12 rounded-full
        bg-red-100 dark:bg-red-500/90"
    >
      <MiniExclamationTriangleIcon className="text-red-600 dark:text-red-50" />
    </div>
  {:else if icon === "warning"}
    <div
      class="mx-auto flex items-center justify-center h-12 w-12 rounded-full
        bg-amber-100 dark:bg-amber-500/90"
    >
      <MiniExclamationTriangleIcon className="text-amber-600 dark:text-amber-50" />
    </div>
  {:else if icon === "info"}
    <div
      class="mx-auto flex items-center justify-center h-12 w-12 rounded-full
        bg-sky-100 dark:bg-cyan-500/90"
    >
      <MiniInformationCircleicon className="text-sky-600 dark:text-cyan-50" />
    </div>
  {/if}
  <div class="mt-3 text-center sm:mt-5">
    {#if title}
      <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">{title}</h3>
    {:else if title === undefined || title === null}
      {#if (icon === "error" || icon === "danger") && ((Array.isArray(messages) && messages.length > 1) || (json !== null && multipleJsonEntries))}
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">{$t("error.followingErrorsOccurred")}</h3>
      {:else if icon === "error" || icon === "danger"}
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">{$t("error.errorOccurred")}</h3>
      {:else if icon === "success"}
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">{$t("success")}</h3>
      {:else if icon === "warning"}
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">{$t("warning")}</h3>
      {:else if icon === "info"}
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">{$t("information")}</h3>
      {/if}
    {/if}
    <div class="mt-2 text-sm text-gray-500 dark:text-zinc-400">
      {#if messages === undefined && (icon === "error" || icon === "danger")}
        <p class:pre-whitespace={pre}>{$t("error.unknown")}</p>
      {:else if json !== null && jsonObjectEntries.length === 1 && jsonObjectEntries[0][1].length === 1}
        <p class:pre-whitespace={pre}>
          {$t(parseApiErrorParameter(jsonObjectEntries[0][1][0]).errorCode, parseApiErrorParameter(jsonObjectEntries[0][1][0]).params)}
        </p>
      {:else if json !== null}
        <div class="text-left">
          <ul class="list-disc pl-7 space-y-1">
            {#each Object.entries(json) as [fieldName, errorArray]}
              {#each errorArray as errorItem}
                <li class:pre-whitespace={pre}>
                  {$t(parseApiErrorParameter(errorItem).errorCode, parseApiErrorParameter(errorItem).params)}
                </li>
              {/each}
            {/each}
          </ul>
        </div>
      {:else if typeof messages === "string"}
        <p class:pre-whitespace={pre}>{messages}</p>
      {:else if Array.isArray(messages) && messages.length == 1}
        <p class:pre-whitespace={pre}>{messages[0]}</p>
      {:else if Array.isArray(messages)}
        <div class="text-left">
          <ul class="list-disc pl-7">
            {#each messages as message}
              {#if typeof message === "string"}
                <li class:pre-whitespace={pre}>{message}</li>
              {:else if typeof message === "object"}
                <li>
                  <b>{message.fieldName}:</b>
                  <span class:pre-whitespace={pre}>{message.message}</span>
                </li>
              {/if}
            {/each}
          </ul>
        </div>
      {:else if messages !== undefined && messages !== null && typeof messages === "object"}
        <p class:pre-whitespace={pre}>{messages.toString()}</p>
      {/if}
    </div>
  </div>
  <div slot="footer">
    <Button on:click={closeModal} focused={true} block={true} type={icon === "error" || icon === "danger" || icon === "warning" ? icon : null}>
      {closeText}
    </Button>
  </div>
</Modal>
