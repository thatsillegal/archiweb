<template>

    <section>
        <div
                id="gui-container"
                style="position:absolute;right:0"
        ></div>
        <template
                style="overflow:auto;background:#ffffff;"
        >

            <div class="d-flex justify-sm-center" id="container"></div>
        </template>

    </section>

</template>

<script>
    import {main} from '@/assets/js/index.js'
    import {initGUI} from '@/assets/js/gui.js'
    export default {
        name: 'Viewer',
        data: () => ({}),
        mounted() {
            initGUI();
            main();
        }
    }
</script>
