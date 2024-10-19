<script>
  import Button from "$components/common/Button.svelte";
  import { t } from "svelte-i18n"; // Localization

  export let visitor;
  export let onEdit;
  export let onDelete;
</script>

<div class="border  rounded p-4 mb-6">
  <p><b>{$t("visitor.name")}</b>: {visitor.firstName} {visitor.surname}</p>
  <p><b>{$t("visitor.email")}</b>: {visitor.email}</p>
  <p><b>{$t("visitor.mobileNumber")}</b>: {visitor.mobileNumber}</p>
  <!-- <p>{$t("registervisitor.companyLabel")}: {visitor.companyNam}</p>
  <p>{$t("registervisitor.purposeLabel")}: {visitor.purpose}</p>
  <p>{$t("visitor.hostName")}: {visitor.host}</p>
  <p>{$t("visitor.selectedDateTime")}: {visitor.startDate} {visitor.startTime}</p>
  <p>{$t("visitor.endDateTime")}: {visitor.endDate} {visitor.endTime}</p>
  <p>{$t("visitor.location")}: {visitor.location}</p> -->
  <div class="flex justify-between mt-2">
      <Button on:click={onEdit} className="w-full sm:w-auto py-3 sm:py-4 px-7 text-lg mt-5">{$t("visitor.edit")}</Button>
      <Button on:click={onDelete} className="w-full sm:w-auto py-3 sm:py-4 px-7 text-lg mt-5">{$t("visitor.delete")}</Button>
  </div>
</div>
