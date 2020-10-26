<template>
    <div>
        <v-app-bar
                app
                color="black"
                flat
        >
            <div class="d-flex">
                <v-img
                        alt="Logo"
                        class="shrink mr-2"
                        contain
                        src="@/assets/AAA-logo-text.png"
                        transition="scale-transition"
                        width="40"
                />

                <div class="d-flex hidden-md-and-down align-end">
                    <a class="text-decoration-none" href="http://labaaa.org" style="color:#ffffff;" target="_blank">
                        <h2 class="pr-2">ArchiWeb</h2>
                    </a>

                </div>

            </div>
            <v-spacer></v-spacer>
            <v-btn class="white--text" text>
                <v-icon color="white">mdi-cog</v-icon>
            </v-btn>
        </v-app-bar>
    </div>
</template>

<script>
</script>
