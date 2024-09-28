<script>
  import { onMount, tick, createEventDispatcher } from "svelte";
  export let value = "";
  export let label = null;
  export let labelIsSROnly = false;
  export let placeholder = null;
  export let type = "text";
  export let rows = 3;
  export let valid = true;
  export let errorMessage = false;
  export let touched = false;
  export let disabled = false;
  export let required = false;
  export let tabindex = null;
  export let containerClass = null;
  export let helperText = null;
  export let autofocus = false;
  export let errorUseVisibility = false;
  export let trim = true;
  export let enterSubmit = false;
  export let autocomplete = null;

  if (placeholder === null) {
    placeholder = label;
  }

  const dispatch = createEventDispatcher();

  let passwordType = type;
  let passwordShown = false;

  // Generate random string for name
  let name = Math.random()
    .toString(36)
    .slice(2);

  async function toggleShowPass(e) {
    if (disabled) {
      return;
    }

    passwordShown = !passwordShown;
    passwordType = passwordShown ? "text" : "password";

    if (inputElem) {
      await tick();
      const end = inputElem.value.length;
      inputElem.setSelectionRange(end, end);
      inputElem.focus();
    }
  }

  function handleInput(e) {
    value = e.target.value;
    dispatch("input", e);
  }

  function handleBlur(e) {
    touched = true;

    if (trim) {
      // Trim input on blur
      if (type === "text" && value && value.replace) {
        value = value.replace(/\s+/g, " ").trim();
      } else if (type === "textarea" && value && value.replace) {
        value = value
          .replace(/^[^\S\r\n]+/gm, "")
          .replace(/[^\S\r\n]+$/gm, "")
          .replace(/ +/gm, " ")
          .trim();
      }
    }

    dispatch("blur", e);
  }

  function handleKeydown(e) {
    if (enterSubmit) {
      return;
    }

    let key = e.keyCode;
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  function getBorderColor() {
    if (!valid && touched) {
      return "focus:ring-red-500 focus:border-red-500 border-red-300";
    } else {
      return "focus:ring-primary focus:border-primary border-gray-300";
    }
  }

  $: borderClasses = getBorderColor(!valid && touched);

  let inputElem = null;

  onMount(function() {
    if (inputElem && autofocus) {
      inputElem.focus();
    }
  });
</script>

<!-- <div>
  <label for="about" class="block text-2xl font-medium text-gray-700">
    About
  </label>
  <div class="mt-1">
    <textarea
      id="about"
      name="about"
      rows="3"
      class="shadow-sm focus:ring-primary focus:border-primary mt-1 block
      w-full sm:text-2xl border border-gray-300 rounded-md"
      placeholder="you@example.com" />
  </div>
  <p class="mt-2 text-2xl text-gray-500">
    Brief description for your profile. URLs are hyperlinked.
  </p>
</div> -->
<div class={containerClass}>
  {#if label}
    {#if labelIsSROnly}
      <label for={name} class="sr-only">{label}</label>
    {:else}
      <!-- see "Before and after": https://tailwindcss.com/docs/hover-focus-and-other-states?email=george%40krugerindustrial.ac&password=Bosco -->
      <label for={name} class="block">
        <span
          class="{required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''}
          block text-2xl font-medium text-gray-700">
          {label}
        </span>
      </label>
    {/if}
  {/if}
  {#if type === 'password'}
    <div class="relative">
      <input
        bind:this={inputElem}
        type={disabled ? 'password' : passwordType}
        class="mt-1 block w-full shadow-sm sm:text-2xl rounded-md
        disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200
        disabled:shadow-none {borderClasses}"
        {value}
        id={name}
        {name}
        {placeholder}
        {disabled}
        {tabindex}
        autocomplete={autocomplete !== null ? autocomplete : "current-password"}
        on:input={handleInput}
        on:blur={handleBlur}
        on:keydown={handleKeydown} />
      <div
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-2xl
        leading-5 select-none">

        <svg
          on:click|preventDefault={toggleShowPass}
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-500 cursor-pointer"
          class:hidden={(disabled ? 'password' : passwordType) === 'password' ? false : true}
          viewBox="0 0 20 20"
          fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fill-rule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274
            4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0
            018 0z"
            clip-rule="evenodd" />
        </svg>
        <svg
          on:click|preventDefault={toggleShowPass}
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-500 cursor-pointer"
          class:hidden={(disabled ? 'password' : passwordType) !== 'password' ? false : true}
          viewBox="0 0 20 20"
          fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0
            001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943
            14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261
            4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0
            00-5.478-5.478z"
            clip-rule="evenodd" />
          <path
            d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98
            9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105
            2.454-.303z" />
        </svg>

        <!-- <svg
          on:click|preventDefault={toggleShowPass}
          class="h-6 text-gray-700"
          class:hidden={(disabled ? 'password' : passwordType) === 'password' ? false : true}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewbox="0 0 576 512">
          <path
            fill="currentColor"
            d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48
            241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288
            448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288
            400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31
            95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0
            288 160z" />
        </svg>
        <svg
          on:click|preventDefault={toggleShowPass}
          class="h-6 text-gray-700"
          class:hidden={(disabled ? 'password' : passwordType) !== 'password' ? false : true}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewbox="0 0 640 512">
          <path
            fill="currentColor"
            d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79
            17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41
            197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13
            144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0
            81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320
            64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23
            6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0
            22.46-2.81l19.64-25.27a16 16 0 0
            0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416
            256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64
            46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92
            143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z" />
        </svg> -->
      </div>

    </div>
  {:else if type === 'textarea'}
    <textarea
      bind:this={inputElem}
      class="shadow-sm mt-1 block w-full sm:text-2xl border rounded-md
      disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200
      disabled:shadow-none {borderClasses}"
      {rows}
      {value}
      id={name}
      {name}
      {placeholder}
      {disabled}
      {tabindex}
      on:input={handleInput}
      on:blur={handleBlur} />
  {:else if type === 'text'}
    <input
      bind:this={inputElem}
      {type}
      class="mt-1 block w-full shadow-sm sm:text-2xl rounded-md
      disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200
      disabled:shadow-none {borderClasses}"
      {value}
      id={name}
      {name}
      {placeholder}
      {disabled}
      {tabindex}
      autocomplete={autocomplete !== null ? autocomplete : "new-password"}
      on:input={handleInput}
      on:blur={handleBlur}
      on:keydown={handleKeydown} />
  {/if}
  {#if errorUseVisibility}
    <p
      class="text-2xl text-rose-500 font-medium {helperText ? '-mb-3' : ''}"
      class:invisible={!(errorMessage && !valid && touched)}>
      {errorMessage}
    </p>
  {:else if errorMessage && !valid && touched}
    <p class="text-2xl text-rose-500 font-medium {helperText ? '-mb-3' : ''}">
      {errorMessage}
    </p>
  {/if}
  {#if helperText}
    <p class="mt-2 text-2xl text-gray-500 leading-4">{helperText}</p>
  {/if}
</div>
