<script>
  export let label = "";
  export let bindValue;
</script>

<div>
  <label for="date-input" class="block mb-2 text-gray-600">{label}</label>
  <input
    type="date"
    id="date-input"
    bind:value={bindValue}
    class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
</div>
