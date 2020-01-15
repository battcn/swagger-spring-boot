<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="component-link-content">
    <div class="link-content-left">
      <slot name="content-left"></slot>
    </div>
    <div class="link-content-right">
      <slot name="content-right"></slot>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'component-link-content'
  }
</script>