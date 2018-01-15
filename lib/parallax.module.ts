import { NgModule, ModuleWithProviders } from "@angular/core";
import { Parallax } from "./parallax.directive";

@NgModule({
    declarations: [
        Parallax
    ],
    exports: [
        Parallax
    ]
})
export class ParallaxModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ParallaxModule,
            providers: []
        };
    }
}