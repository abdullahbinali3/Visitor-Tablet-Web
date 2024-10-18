<script>
  export let label = "";
  export let bindValue = "";
  export let valueChanged;
</script>

<div>
  <label for="time-input" class="block mb-2 text-gray-600">{label}</label>
  <input
    type="time"
    id="time-input"
    bind:value={bindValue}
    enterSubmit={true}
    on:input={(e) => valueChanged(e.target.value)}
    class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
</div>
