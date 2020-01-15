<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="component-card-content">
    <div class="card-title">{{title}}</div>
    <div class="card-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'component-card-content',
    props: ['title']
  }
</script>