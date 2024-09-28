<script>
  import { url } from "@roxi/routify";
  import { t } from "svelte-i18n";
  import Panel from "$components/layout/Panel.svelte";
  import ButtonRounded from "$components/common/ButtonRounded.svelte";
</script>

<div class="p-4 sm:p-6 lg:p-8">
  <Panel>
    <p class="text-2xl mb-6">{$t("login.supportText")}</p>
    <ButtonRounded href={$url("/")}>
      {$t("support.goBackHome")}
    </ButtonRounded>
  </Panel>
</div>
