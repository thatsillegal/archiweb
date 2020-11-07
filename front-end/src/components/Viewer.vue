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
import {main} from '@/viewers/3D/index'
import InfoCard from "@/components/InfoCard";

export default {
  name: 'Viewer',
  components: {InfoCard},
  data: () => ({}),
  mounted() {
    main();
  }
}
</script>

<style>

.v-application .title {
  font-size: 0.9rem !important;
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
  appearance: menulist;
  font-size: 12px;
}
</style>
