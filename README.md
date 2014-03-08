# xgen

xgen, inspired by [ngen](https://github.com/visionmedia/ngen)


## Install

```
npm install -g xgen
```


## Usage

```  
Usage: xgen [options]

  Options:

    -h, --help                  output usage information
    -v, --version               output the version number
    -t, --template <string>     Use the template <template>
    -d, --destination <string>  Use the destination directory <dest>


  Usage: xgen [options]

  Demos:

    xgen                       use template <default> to generate under current directory
    xgen -d /data/projects     use template <default> to generate under directory </data/projects>
    xgen -d just_here          use template <default> to generate under folder <just_here> which is a relative path
    xgen -t my_own_template    use template <my_own_template> to generate under current directory
    xgen -t my_own_template -d /data/projects use template <my_own_template> to generate under directory </data/projects>

find more info - github.com/sumory/xgen
```
