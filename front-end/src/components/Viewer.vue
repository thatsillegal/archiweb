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

<style>
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
