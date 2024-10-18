<script>
	import { goto } from '@roxi/routify';
	import  buildingData  from '$stores/buildings-store.js';
    import { onMount ,onDestroy } from "svelte";
    // Import necessary components
    import { get } from 'svelte/store';
    import InputText from "$components/form/TextInput.svelte";
    import SelectInput from "$components/form/SelectInput.svelte";
    import Button from "$components/common/Button.svelte";
    import DateInput from "$components/form/DateInput.svelte";
    import TimeInput from "$components/form/TimeInput.svelte";
    import VisitorCard from "$components/common/VisitorCard.svelte";
    import { t } from "svelte-i18n"; // Localization
    import appData from "$stores/app-data-store.js";
    import { postVisitorData, getHosts } from "$helpers/api.js";
    import { validateForm } from "$helpers/errors.js";
    import Notification from "$components/common/Notification.svelte";
    import CaretLeftSolid from "$icons/SolidChevronLeftIcon.svelte";
    // State variables
    let hostItems = [];
    let showToast = false;
    let toastTitle = "";
    let toastMessages = [];
    let toastIcon = "success";
    let organizationId = localStorage.getItem("selectedOrganizationId")
    let userId = localStorage.getItem("uid")
    let buildingId = localStorage.getItem("selectedBuildingId")
    let visitors = {
        host: "",
        companyName: "",
        purpose: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        users: [], // Array to hold user objects
    };

    let userFields = {
        firstName: "",
        surname: "",
        email: "",
        mobileNumber: "",
    };

    let errors = {}; // Object to hold validation errors
    let userLength = [];

    // get host from apis
    onMount(() => {
        getHosts(organizationId)
            .then((response) => {
                hostItems = response.records;
            })
            .catch((err) => {
                console.log(err.message);
            });
    });


    // calling the toast messages
    function triggerToast(title, messages, icon) {
        toastTitle = title;
        toastMessages = messages;
        toastIcon = icon;
        showToast = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Automatically hide the toast after a few seconds
        setTimeout(() => {
            showToast = false;
        }, 4500);
    }

    // Handle form submission
    function resetForm() {
        visitors = {
            location: "",
            host: "",
            companyName: "",
            purpose: "",
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            users: [],
        };
        userFields = {
            firstName: "",
            surname: "",
            email: "",
            mobileNumber: "",
        };
        userLength = [];
        errors = {};
    }


    // functon to submit api data
    async function handleSubmit(event) {
        event.preventDefault();

        const { valid, errors: validationErrors } = validateForm(visitors, userFields);
        if (!valid) {
            errors = validationErrors;
            return;
        }
        addVisitor();

        const dataToSubmit = {
            formCompletedByUid: userId,
            buildingId: buildingId,
            organizationId: organizationId,
            hostUid: visitors.host,
            insertDateUtc: new Date().toISOString(),
            purpose: visitors.purpose,
            company: visitors.companyName,
            signInDateUtc: new Date().toISOString(),
            signOutDateUtc: new Date().toISOString(),
            startDateUtc: new Date(`${visitors.startDate}T${visitors.startTime}`).toISOString(),
            endDateUtc: new Date(`${visitors.endDate}T${visitors.endTime}`).toISOString(),
            users: visitors.users.map((user) => ({
                firstName: user.firstName,
                surname: user.surname,
                email: user.email,
                mobileNumber: user.mobileNumber,
            })),
        };
        const customHeader = {
            "Content-Type": "application/json",
        };

        try {
            await postVisitorData(dataToSubmit, customHeader);
            triggerToast("Success!", ["Visitor registered successfully"], "success");
            resetForm();
        } catch (err) {
            console.error("Error submitting data:", err);
            triggerToast("Error!", ["Failed to register visitor"], "error");
        }
    }

    // Add user to the visitors object
    function addVisitor() {
        const { valid, errors: validationErrors } = validateForm(visitors, userFields);
        if (!valid) {
            errors = validationErrors;
            return;
        }

        // Add the current userFields to the users array in visitors

        visitors.users?.push({ ...userFields }); // Add user details
        clearFormFields(); // Clear input fields
        userLength = visitors.users;
        console.log(visitors);
    }

    // Clear all input fields
    function clearFormFields() {
        Object.keys(userFields).forEach((key) => (userFields[key] = "")); // Clear userFields
        errors = {}; // Reset errors
    }

    // Delete a user from the users array by index
    function deleteUser(index) {
        visitors.users.splice(index, 1); // Use splice to remove the user by index
        userLength = visitors.users; // Update the userLength to reflect the changes
    }

    // Edit a user's data
    function editUser(index) {
        const userToEdit = visitors.users[index];
        userFields = { ...userToEdit }; // Fill userFields with the selected user's data
        deleteUser(index); // Remove the user from the list after fetching their data
    }
 

</script>

<div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
    <div class="max-w-3xl w-full min-h-[500px] sm:min-h-[400px] space-y-4 bg-white p-10 sm:p-12 lg:p-16 rounded-3xl relative">
      <div class="flex cursor-pointer" on:click={$goto("/welcome")}>
    <CaretLeftSolid />
    <p>Back</p>
      </div>
        <h1 class="text-2xl font-semibold text-center mb-6">{$t("registervisitor.title")}</h1>

        {#if showToast}
            <Notification  icon={toastIcon} title={toastTitle} messages={toastMessages} />
        {/if}

        <form on:submit={handleSubmit}>
            
                <div class="mb-6">
                    <label for="host" class="block mb-2 text-gray-600">{$t("registervisitor.selecthostLabel")}</label>
                    <SelectInput items={hostItems} bind:value={visitors.host} />
                    {#if errors.host}<p class="mt-1 capitalize text-red-600 text-sm">{errors.host}</p>{/if}
                </div>
          

            <div class="mb-4">
                <InputText
                    bind:value={visitors.companyName}
                    label={$t("registervisitor.companyPlaceholder")}
                    type="text"
                    placeholder={$t("registervisitor.companyPlaceholder")}
                    enterSubmit={true}
                />
                {#if errors.companyName}<p class="mt-1 capitalize text-red-600 text-sm">{errors.companyName}</p>{/if}
            </div>
            <div class="mb-4">
                <label for="purpose" class="block mb-2 text-gray-600">{$t("registervisitor.purposePlaceholder")}</label>
                <textarea
                    bind:value={visitors.purpose}
                    class="w-full border border-gray-300 rounded-md p-2"
                    placeholder={$t("registervisitor.purposePlaceholder")}
                ></textarea>
                {#if errors.purpose}<p class="mt-1 capitalize text-red-600 text-sm">{errors.purpose}</p>{/if}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <DateInput label={$t("startDate")} bindValue={visitors.startDate} valueChanged={(newDate) => (visitors.startDate = newDate)} />
                    {#if errors.startDate}<p class="text-red-600 capitalize text-sm mb-4">{errors.startDate}</p>{/if}
                </div>
                <div>
                    <TimeInput label={$t("startTime")} bindValue={visitors.startTime} valueChanged={(newTime) => (visitors.startTime = newTime)} />
                    {#if errors.startTime}<p class="text-red-600 capitalize text-sm mb-4">{errors.startTime}</p>{/if}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <DateInput label={$t("endDate")} bindValue={visitors.endDate} valueChanged={(newDate) => (visitors.endDate = newDate)} />
                    {#if errors.endDate}<p class="text-red-600 capitalize text-sm mb-4">{errors.endDate}</p>{/if}
                </div>
                <div>
                    <TimeInput label={$t("endTime")} bindValue={visitors.endTime} valueChanged={(newTime) => (visitors.endTime = newTime)} />
                    {#if errors.endTime}<p class="text-red-600 capitalize text-sm mb-4">{errors.endTime}</p>{/if}
                </div>
            </div>
            {#if errors.dates}<p class="text-red-600 capitalize text-sm mb-4">{errors.dates}</p>{/if}

            <div class="divider border-t-2 border-gray-700 mx-14 my-9"></div>

            {#if userLength?.length > 0}
            <h2 class="text-2xl mb-3 font-semibold">{$t("registervisitor.addedVisitors")}</h2>
            <div class=" mb-6">
                {#each userLength as visitor, index}
                    <VisitorCard {visitor} onEdit={() => editUser(index)} onDelete={() => deleteUser(index)} />
                {/each}
            </div>
        {/if}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {#each [{ key: "firstName", placeholder: $t("registervisitor.firstnamePlaceholder") }, { key: "surname", placeholder: $t("registervisitor.surnamePlaceholder") }, { key: "email", type: "email", placeholder: $t("login.emailPlaceholder") }, { key: "mobileNumber", type: "number", placeholder: $t("registervisitor.mobilenumberPlaceholder") }] as { key, type = 'text', placeholder }}
                    <div>
                        <InputText
                            bind:value={userFields[key]}
                            label={placeholder}
                            {type}
                            {placeholder}
                            enterSubmit={true}
                            on:input={() => (errors[key] = "")}
                        />
                        {#if errors[key]}<p class="mt-1 capitalize text-red-600 text-sm">{errors[key]}</p>{/if}
                    </div>
                {/each}
            </div>

            <div class="flex justify-center mb-4">
                <Button className="w-full sm:w-auto py-3 sm:py-4 text-lg mt-5" on:click={addVisitor}>{$t("AddVisitor")}</Button>
            </div>

            <div class="flex justify-center">
                <Button className="w-full sm:w-auto py-3 sm:py-4 text-lg mt-5" on:click={handleSubmit} type="submit">
                    {$t("submit.submitButton")}
                </Button>
            </div>
        </form>
    </div>
</div>
