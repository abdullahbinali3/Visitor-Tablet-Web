<script>
  export let label = "";
  export let bindValue = '';
  export let valueChanged;
</script>

<div>
  <label for="date-input" class="block mb-2 text-gray-600">{label}</label>
  <input
    type="date"
    bind:value={bindValue}
    on:input={(e) => valueChanged(e.target.value)} 
    class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
</div>