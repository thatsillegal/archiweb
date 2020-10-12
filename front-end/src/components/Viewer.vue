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
    import {main} from '@/viewers/index.js'
    import {initGUI} from '@/viewers/gui.js'
    export default {
        name: 'Viewer',
        data: () => ({}),
        mounted() {
            main();
            initGUI();
        }
    }
</script>
