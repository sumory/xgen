#!/usr/bin/env node

var commander = require('commander');
var fs = require('fs');
var path = require('path');
var colors = require('colors');
var version = require('./package.json').version;
var Template = require('./template.js');

colors.setTheme({
    info: 'blue',
    warn: 'yellow',
    error: 'red'
});

console.warn = function(c){
    var args = Array.prototype.slice.apply(arguments);
    console.log(args.join('').warn);
};

console.error = function(c){
    var args = Array.prototype.slice.apply(arguments);
    console.log(args.join('').error);
};

console.info = function(c){
    var args = Array.prototype.slice.apply(arguments);
    console.log(args.join('').info);
};

commander.version(version)
    .option('-t, --template <string>', 'Use the template <template>')
    .option('-d, --destination <string>', 'Use the destination directory <dest>')
    //.option('-l, --list', 'List all templates')
    //.option('-s, --show <string>', 'Show architecture of the template <template>')
    .option('-v, --version', 'Show the current version');

commander.on('--help', function() {
    var usage = [
        '',
        '  Usage: xgen [options]',
        '',
        '  Demos:',
        '',
        '    xgen                       use template <default> to generate under current directory',
        '    xgen -d /data/projects     use template <default> to generate under directory </data/projects>',
        '    xgen -d just_here          use template <default> to generate under folder <just_here> which is a relative path',
        '    xgen -t my_own_template    use template <my_own_template> to generate under current directory',
        '    xgen -t my_own_template -d /data/projects use template <my_own_template> to generate under directory </data/projects>',
        '',
        '  find more info - github.com/sumory/xgen',
        ''
    ].join('\n');

    console.info(usage);
});

commander.parse(process.argv);


try {
    template = commander.template || 'default';
    default_dest = 'xgen-demo'; //default folder to generate under current directory
    if (!commander.destination) {
        console.warn('You have not given a folder name. Use default name <', default_dest, '>.');
    }
    destination = path.resolve(process.cwd(), commander.destination || default_dest);

    var tmpl = new Template(template, destination);
    tmpl.init();
} catch (e) {
    console.error(e);
    process.exit(-1);
}

//node xgen.js -d /data
//node xgen.js -d /data/m -t default
//node xgen.js -t default
//node xgen.js