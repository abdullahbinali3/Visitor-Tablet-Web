<script>
  import { url } from "@roxi/routify";
  import { t } from "svelte-i18n";
  import appData from "$stores/app-data-store.js";

  $appData.pageTitle = "Page Not Found";
  $appData.breadcrumbs = [];
</script>

<div
  class="min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center
  lg:px-8">
  <div class="max-w-max md:mx-auto">
    <main class="sm:flex">
      <p class="text-4xl font-extrabold text-sky-600 sm:text-5xl">404</p>
      <div class="sm:ml-6">
        <div class="sm:border-l sm:border-gray-300 sm:pl-6">
          <h1
            class="text-4xl font-extrabold text-gray-700 tracking-tight
            sm:text-5xl">
            {$t("support.pageNotFound")}
          </h1>
          <p class="mt-1 text-base text-gray-500">
            {$t("support.backToHomePage")}
          </p>
        </div>
        <div
          class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
          <a
            href={$url("/")}
            class="inline-flex items-center px-4 py-2 border border-transparent
            text-sm font-medium rounded-md shadow-sm text-white bg-sky-600
            hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-sky-500">
            {$t("support.goBackHome")}
          </a>
          <a
            href={$url("/support")}
            class="inline-flex items-center px-4 py-2 border border-transparent
            text-sm font-medium rounded-md text-sky-700 bg-sky-100
            hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-sky-500">
            {$t("support.contactSupport")}
          </a>
        </div>
      </div>
    </main>
  </div>
</div>
