<template>
  
  <section>
    <div
      id="gui-container"
      style="position:absolute;right:0;z-index:999"
    ></div>
    
    <InfoCard
      id="info-card"
      style="position:absolute;bottom:64px;left:10px;z-index:1"
    ></InfoCard>
    <div
      id="info"
      style="position:fixed;top:64px;left:20px;z-index:1"
    >
      "W" translate | "E" rotate | "R" scale<br/>
      "Q" toggle world/local space | "Shift" snap to grid<br/>
      "C" toggle camera | "T" toggle enabled
    </div>
    
    <template style="background:#ffffff;">
      <div id="container" class="d-flex justify-sm-center">
      </div>
    </template>
  
  </section>

</template>

<script>
import {main} from '@/viewers/index.js'
import {initGUI} from '@/viewers/gui.js'
import InfoCard from "@/components/InfoCard";

export default {
  name: 'Viewer',
  components: {InfoCard},
  data: () => ({}),
  mounted() {
    main();
    initGUI();
  }
}
</script>

<style>
.info {
  font-size: 0.9rem;
}

.v-application .title {
  font-size: 0.9rem !important;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em !important;
  font-family: "Lucida Grande", sans-serif !important;
}

.dg .c input[type=checkbox] {
  margin-top: 3px;
}

input {
  height: 1.25rem
}

select {
  background: #FFFFFF;
  /* -webkit-writing-mode: horizontal-tb !important; */
  text-rendering: auto;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  appearance: menulist;
  box-sizing: border-box;
  align-items: center;
  white-space: pre;
  -webkit-rtl-ordering: logical;
  cursor: default;
  margin: 0em;
  font: 400 12px Arial;
  font-style: normal;
  font-variant-ligatures: normal;
  font-variant-caps: normal;
  font-variant-numeric: normal;
  font-variant-east-asian: normal;
  font-weight: 400;
  font-stretch: normal;
  font-size: 12px;
  line-height: normal;
  font-family: Arial;
  border-radius: 2px;
  border-width: 1px;
  border-style: solid;
  border-image: initial;
}
</style>
