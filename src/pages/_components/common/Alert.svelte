<script>
  import { t } from "svelte-i18n";
  import { parseApiErrorParameter } from "$helpers/validation.js";

  import MiniXCircleIcon from "$components/heroicons/MiniXCircleIcon.svelte";
  import MiniCheckCircleIcon from "$components/heroicons/MiniCheckCircleIcon.svelte";
  import MiniInformationCircleIcon from "$components/heroicons/MiniInformationCircleIcon.svelte";
  import MiniExclamationTriangleIcon from "$components/heroicons/MiniExclamationTriangleIcon.svelte";

  export let type = "danger";
  export let title = null;
  export let marginBottom = true; // true for mb-4, or specify a class, e.g. mb-6
  export let messages = [];
  export let pre = true;
  export let showIcon = true;
  export let dark = false;
  export let rounded = "rounded-md";

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

  function getBackgroundColor(type) {
    // If dark mode is forced, use dark colors only
    if (dark) {
      switch (type) {
        case "danger":
        case "error":
          return "bg-red-600/90";
        case "success":
          return "bg-green-600/90";
        case "info":
          return "bg-cyan-600/90";
        case "warning":
          return "bg-amber-600/90";
      }

      return "";
    }

    switch (type) {
      case "danger":
      case "error":
        return "bg-red-100 dark:bg-red-600/90";
      case "success":
        return "bg-green-100 dark:bg-green-600/90";
      case "info":
        return "bg-sky-100 dark:bg-cyan-600/90";
      case "warning":
        return "bg-amber-100 dark:bg-amber-600/90";
    }

    return "";
  }

  function getTitleColor(type) {
    // If dark mode is forced, use dark colors only
    if (dark) {
      switch (type) {
        case "danger":
        case "error":
          return "text-red-50";
        case "success":
          return "text-green-50";
        case "info":
          return "text-cyan-50";
        case "warning":
          return "text-amber-50";
      }

      return "";
    }

    switch (type) {
      case "danger":
      case "error":
        return "text-red-800 dark:text-red-50";
      case "success":
        return "text-green-800 dark:text-green-50";
      case "info":
        return "text-sky-800 dark:text-cyan-50";
      case "warning":
        return "text-amber-800 dark:text-amber-50";
    }

    return "";
  }

  function getTextColor(type) {
    // If dark mode is forced, use dark colors only
    if (dark) {
      switch (type) {
        case "danger":
        case "error":
        case "success":
        case "info":
        case "warning":
          return "text-white";
      }

      return "";
    }

    switch (type) {
      case "danger":
      case "error":
        return "text-red-700 dark:text-white";
      case "success":
        return "text-green-700 dark:text-white";
      case "info":
        return "text-sky-700 dark:text-white";
      case "warning":
        return "text-amber-700 dark:text-white";
    }

    return "";
  }

  function getIconColor(type) {
    // If dark mode is forced, use dark colors only
    if (dark) {
      switch (type) {
        case "danger":
        case "error":
          return "text-red-100";
        case "success":
          return "text-green-100";
        case "info":
          return "text-cyan-100";
        case "warning":
          return "text-amber-100";
      }

      return "";
    }

    switch (type) {
      case "danger":
      case "error":
        return "text-red-400 dark:text-red-100";
      case "success":
        return "text-green-400 dark:text-green-100";
      case "info":
        return "text-sky-400 dark:text-cyan-100";
      case "warning":
        return "text-amber-400 dark:text-amber-100";
    }

    return "";
  }

  function getLinkColor(type) {
    // If dark mode is forced, use dark colors only
    if (dark) {
      switch (type) {
        case "danger":
        case "error":
          return "font-medium text-red-800 underline hover:text-red-600 cursor-pointer";
        case "success":
          return "font-medium text-green-800 underline hover:text-green-600 cursor-pointer";
        case "info":
          return "font-medium text-sky-800 underline hover:text-sky-600 cursor-pointer";
        case "warning":
          return "font-medium text-amber-800 underline hover:text-amber-600 cursor-pointer";
      }

      return "";
    }

    switch (type) {
      case "danger":
      case "error":
        return "font-medium text-red-800 underline hover:text-red-600 cursor-pointer dark:text-red-200 dark:hover:text-red-100";
      case "success":
        return "font-medium text-green-800 underline hover:text-green-600 cursor-pointer dark:text-green-200 dark:hover:text-green-100";
      case "info":
        return "font-medium text-sky-800 underline hover:text-sky-600 cursor-pointer dark:text-cyan-200 dark:hover:text-cyan-100";
      case "warning":
        return "font-medium text-amber-800 underline hover:text-amber-600 cursor-pointer dark:text-amber-200 dark:hover:text-amber-100";
    }

    return "";
  }

  $: bgColor = getBackgroundColor(type);
  $: titleColor = getTitleColor(type);
  $: textColor = getTextColor(type);
  $: iconColor = getIconColor(type);
  $: linkClasses = getLinkColor(type);
</script>

<div class="{rounded} font-normal p-4 {bgColor} {marginBottom ? 'mb-4' : !marginBottom ? '' : marginBottom}">
  <div class="flex text-left items-center">
    {#if showIcon}
      <div class="flex-shrink-0 self-start">
        {#if type === "error" || type === "danger"}
          <MiniXCircleIcon className={iconColor} />
        {:else if type === "success"}
          <MiniCheckCircleIcon className={iconColor} />
        {:else if type === "info"}
          <MiniInformationCircleIcon className={iconColor} />
        {:else if type === "warning"}
          <MiniExclamationTriangleIcon className={iconColor} />
        {/if}
      </div>
    {/if}
    <div class:ml-3={showIcon}>
      {#if title}
        <h3 class="text-sm font-medium {titleColor}">{title}</h3>
      {:else if (type === "danger" || type === "error") && ((Array.isArray(messages) && messages.length > 1) || (json !== null && multipleJsonEntries))}
        <h3 class="text-sm font-medium {titleColor} pb-1">{$t("error.followingErrorsOccurred")}</h3>
      {/if}
      <div
        class="text-sm {title || ((type === 'danger' || type === 'error') && Array.isArray(messages) && messages.length > 1) ? 'mt-2' : ''}
            {textColor} break-words leading-4"
      >
        <slot {linkClasses}>
          {#if (title === null || title === undefined || title === "") && messages === undefined && (type === "error" || type === "danger")}
            <p class:pre-whitespace={pre}>{$t("error.unknown")}</p>
          {:else if title && messages === undefined && (type === "error" || type === "danger")}
            <ul class="list-disc pl-7 space-y-1">
              <li class:pre-whitespace={pre}>
                {$t("error.unknown")}
              </li>
            </ul>
          {:else if (title === null || title === undefined || title === "") && json !== null && jsonObjectEntries.length === 1 && jsonObjectEntries[0][1].length === 1}
            <p class:pre-whitespace={pre}>
              {$t(parseApiErrorParameter(jsonObjectEntries[0][1][0]).errorCode, parseApiErrorParameter(jsonObjectEntries[0][1][0]).params)}
            </p>
          {:else if title && json !== null && jsonObjectEntries.length === 1 && jsonObjectEntries[0][1].length === 1}
            <ul class="list-disc pl-7 space-y-1">
              <li class:pre-whitespace={pre}>
                {$t(parseApiErrorParameter(jsonObjectEntries[0][1][0]).errorCode, parseApiErrorParameter(jsonObjectEntries[0][1][0]).params)}
              </li>
            </ul>
          {:else if json !== null}
            <ul class="list-disc pl-7 space-y-1">
              {#each Object.entries(json) as [fieldName, errorArray]}
                {#each errorArray as errorItem}
                  <li class:pre-whitespace={pre}>
                    {$t(parseApiErrorParameter(errorItem).errorCode, parseApiErrorParameter(errorItem).params)}
                  </li>
                {/each}
              {/each}
            </ul>
          {:else if (title === null || title === undefined || title === "") && typeof messages === "string"}
            <p class:pre-whitespace={pre}>{messages}</p>
          {:else if title && typeof messages === "string"}
            <ul class="list-disc pl-7 space-y-1">
              <li class:pre-whitespace={pre}>
                {messages}
              </li>
            </ul>
          {:else if (title === null || title === undefined || title === "") && Array.isArray(messages) && messages.length == 1}
            <p class:pre-whitespace={pre}>{messages[0]}</p>
          {:else if title && Array.isArray(messages) && messages.length == 1}
            <ul class="list-disc pl-7 space-y-1">
              <li class:pre-whitespace={pre}>
                {messages[0]}
              </li>
            </ul>
          {:else if Array.isArray(messages)}
            <ul class="list-disc pl-7 space-y-1">
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
          {:else if (title === null || title === undefined || title === "") && messages !== undefined && messages !== null && typeof messages === "object"}
            <p class:pre-whitespace={pre}>{messages.toString()}</p>
          {:else if title && messages !== undefined && messages !== null && typeof messages === "object"}
            <ul class="list-disc pl-7 space-y-1">
              <li class:pre-whitespace={pre}>
                {messages.toString()}
              </li>
            </ul>
          {/if}
        </slot>
        {#if $$slots.additionalInfo}
          <slot name="additionalInfo" {linkClasses} />
        {/if}
      </div>
    </div>
  </div>
</div>
