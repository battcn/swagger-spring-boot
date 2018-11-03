<template>
  <div v-show="control" class="pop-ups">
    <div>
      <h2 style="color: #c94e50;"><strong>{{hint}}</strong></h2>
      <div>
        <button @click="control=false"
                style="padding: 1em 2em;outline: none;font-weight: 600;border: none;color: #fff;background: #c94e50;">
          close
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "popUps",
    props: ['control', 'hint']
  }
</script>
<style>
  .pop-ups {
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    background: rgba(55, 58, 71, 0.9);
    transition: opacity 0.3s;
  }

  .pop-ups > div {
    width: 50%;
    max-width: 560px;
    min-width: 290px;
    background: #fff;
    padding: 4em;
    text-align: center;
    position: absolute;
    z-index: 5;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
