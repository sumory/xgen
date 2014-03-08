#!/usr/bin/env node

var fs = require('fs');
var path = require('path');


module.exports = Template;

function Template(tmpl, dest) {
    if (fs.existsSync(dest)) {
        console.error('destination folder <', dest, '> exists. choose another one.');
        process.exit(-1);
    }

    this.tmpl_path = __dirname + '/templates/' + tmpl; //指定的模板目录
    if (!fs.existsSync(this.tmpl_path)) {
        console.error('template <', tmpl, '> not exists.');
        process.exit(-1);
    }

    console.info('Generating project with template <' + tmpl + '> under <' + dest + '>' );

    fs.mkdirSync(dest, 0775);
    this.vars = require(this.tmpl_path + '/index.js'); //需要的变量
    this.dest = dest; //新生成文件的目标目录
    this.contentPath = this.tmpl_path + '/content'; //指定模板目录里的文件目录

    this.values = {}; //保存输入的变量值
    this.directories = {}; //模板中的目录
    this.files = []; //模板中的文件
}

/**
 * 初始化
 * @param  {[type]} dest [要生成代码的目标目录]
 */
Template.prototype.init = function() {
    this.walkTemplate();
    this.readVars();
};

Template.prototype.readVars = function() {
    var self = this;
    var keys = Object.keys(self.vars);

    function next() { //根据输入解析模板需要的变量，最后生成目录和文件
        var key = keys.shift(); //按顺序取出变量

        function done(value) {
            self.values[key] = value ? String(value).trim() : '';
            next();
        }

        if (key) {
            process.stdout.write('  \033[90m' + self.vars[key] + '\033[0m');
            process.stdin.setEncoding('utf8');
            process.stdin.once('data', done).resume();

        } else {
            process.stdin.destroy();
            self.create(); //生成目录和文件
        }
    }

    next();
};

Template.prototype.walkTemplate = function() {
    var self = this;

    function next(dir) {
        fs.readdirSync(dir).forEach(function(file) {
            if (file === '.DS_Store') {} else {
                self.files.push(file = dir + '/' + file);
                var stat = fs.statSync(file);
                if (stat.isDirectory()) {
                    self.directories[file] = true;
                    next(file);
                }
            }
        });
    }

    next(self.contentPath); //读取文件和目录
};


Template.prototype.create = function() {
    var self = this;
    if (!('year' in self.values) || !self.values['year']) {
        self.values['year'] = self.values['year'] || new Date().getFullYear();
    }

    self.files.forEach(function(file) {
        var tmpl_path = self.parse(file),
            out = path.join(self.dest, tmpl_path.replace(self.contentPath, '').replace('gitignore', '.gitignore'));


        if (self.directories[file]) { // directory
            try {
                fs.mkdirSync(out, 0775);
                console.log('  \033[90mcreate :\033[0m \033[36m%s\033[0m', out);
            } catch (err) {
                console.error(e);
            }
        } else { // file
            var str = self.parse(fs.readFileSync(file, 'utf8'));
            fs.writeFileSync(out, str);
            console.log('  \033[90mcreate :\033[0m \033[36m%s\033[0m', out);
        }
    });

    console.info('Generate successfully.');
};


Template.prototype.parse = function(str) {
    var self = this;
    return str.replace(/\{\{([^}]+)\}\}/g, function(_, key) {
        return self.values[key];
    });
};