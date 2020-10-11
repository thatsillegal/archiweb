<template>
    <div>
        <v-app-bar
                app
                color="white"
        >
            <div class="d-flex">
                <v-img
                        alt="Logo"
                        class="shrink mr-2"
                        contain
                        src="@/assets/AAA_x128_black.png"
                        transition="scale-transition"
                        width="40"
                />

                <div class="d-flex hidden-md-and-down align-end">
                    <a class="text-decoration-none" href="http://labaaa.org" style="color:#000000;" target="_blank">
                        <h2 class="pr-2">ArchiWeb</h2>
                    </a>

                </div>

            </div>
            <v-spacer></v-spacer>
            <v-btn class="mx-3 white--text" text to="/">
                <v-icon color="black">mdi-home</v-icon>
            </v-btn>
        </v-app-bar>
    </div>
</template>

<script>
</script>
