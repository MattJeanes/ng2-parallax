# ngx-parallax
A parallax plugin/directive for Angular 2+

You can use this directive right now if you write Angular code using SystemJS to import/export files, or at the very least you write it in TypeScript.  ES5 and Dart versions are not yet complete/started, but as demand grows for those as well as the documentation gets updated, those versions will be made available.

### Forked
This is a fork from [cwadrupldijjit/ng2-parallax](https://github.com/cwadrupldijjit/ng2-parallax) - fixing webpack support while maintaining systemjs support and also supporting all angular versions above 2, not just 2.

### Installation of files
In order to install this plugin, you can do one of a few things:

 - Install from npm:
```
npm install --save ngx-parallax
```

  - clone it from the project GitHub repository:
```
git clone https://github.com/MattJeanes/ngx-parallax
```
**If you'd like to contribute, feel free to fork it.**

  - [Download the zip](http://github.com/MattJeanes/ngx-parallax/zipball/master)
  
  - [Download the .tar.gz](http://github.com/MattJeanes/ngx-parallax/tarball/master)

If you have copied/created a version of the directive file (either `parallax.directive.ts` or `parallax.directive.js`), place the copy of the file in a convenient place to reference it in your working directory, and reference however you need to have it be available in the rest of your application.  

To reference it in your application, you can import it just like the rest of the Angular files and components.

#### Using the npm package:
**_For_ `System.js` _Users:_**

First, you have to register where the ngx-parallax is:
```html
<!-- index.html -->
<script>
    System.config({
        paths: {
            '/*': '/app/*',
            'ngx-parallax/*': '/node_modules/ngx-parallax/*' // <--- add this
        },
        packages: {
            app: {
                format: 'register',
                defaultExtension: 'js'
            },
            '/node_modules/ngx-parallax': { // <--- and this
                format: 'register',
                defaultExtension: js
            }
        }
    });
    
    System.import('/app/boot')
        .then(null, console.error.bind(console));
</script>
```

#### Using `webpack` or `systemjs`:
```typescript
import { ParallaxModule, ParallaxConfig } from 'ngx-parallax';
```

#### Using a local copy:
```typescript
import { ParallaxModule, ParallaxConfig } from './path/to/directives/parallax.directive';
```

If you import both Parallax and ParallaxConfig, you can get some IntelliSense or type verification help for the parallaxConfig object you can define in your component's class.  You'll see how to implement that shortly.

In order to get your component to recognize it, you need to add it to your module's annotations like so:

```typescript
@NgModule({
    imports: [
        ParallaxModule  // <----- Right here
    ]
})
```
```

You can then use the directive anywhere within that component itself by sticking it on any element you've put in your template like so:
```html
<h1>Welcome to my website!</h1>

<div parallax></div>
<!-- ^ here ^ -->
```

This plugin assumes you've added styling to the element you've put the "parallax" attribute onto, like height, width, and background-image.  If you'd like to override any of the default settings for the parallax directive when you'd like to customize the functionality.  One way you can do that is by passing in a `[config]` object through the HTML.

```html
<div parallax [config]="{initialValue: -100, ratio: .7}"></div>
```

For more specific information, refer to the examples found at the [project page](http://cwadrupldijjit.com/ng2-parallax/ts-examples), or in the examples folder for the version of the plugin you'd like to use, which you can access when you've cloned or downloaded the project. **Currently, only the TypeScript version works.  The JS version is under development and the Dart version will happen later, when demand is up for it** (or when it's requested and I have time to learn Dart or someone helps to contribute to that version... :P).

Any feedback is much appreciated.  Log issues, send pull requests, you know the drill.

Thanks for showing interest in this project and hope you enjoy it!
