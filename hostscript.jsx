// hostscript.jsx

// ================= 全局配置 =================
var APP_VERSION = "0.1.0"; // 版本号更新
var DIR_PATH = "C:\\Users\\Public\\Zayu_Hook_Translation\\";

// 自定义文件
var FILE_NAME_DICT_NAME = "ZaYu-Customplugin-name-translation.json"; 
var FILE_PARAM_DICT_NAME = "ZaYu-Custom-plugin-parameter-translation.json"; 
var FILE_NAME_DICT = DIR_PATH + FILE_NAME_DICT_NAME; 
var FILE_PARAM_DICT = DIR_PATH + FILE_PARAM_DICT_NAME; 

// 官方/只读文件 (用于比对去重)
var OFFICIAL_NAME_DICT = DIR_PATH + "ZyName.json";
var OFFICIAL_PARAM_DICT = DIR_PATH + "Replace_Map.json";
// 版本日志
var FILE_VERSION_LOG = DIR_PATH + "VERSION.log";

// ================= json2.js JSON 兼容补丁 ================
if (typeof JSON !== "object") {
    JSON = {};
}

(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        return (n < 10) ? "0" + n : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function () {
            return isFinite(this.valueOf())
                ? (
                    this.getUTCFullYear()
                    + "-"
                    + f(this.getUTCMonth() + 1)
                    + "-"
                    + f(this.getUTCDate())
                    + "T"
                    + f(this.getUTCHours())
                    + ":"
                    + f(this.getUTCMinutes())
                    + ":"
                    + f(this.getUTCSeconds())
                    + "Z"
                )
                : null;
        };
        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;

    function quote(string) {
        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }

    function str(key, holder) {
        var i; var k; var v; var length;
        var mind = gap;
        var partial;
        var value = holder[key];

        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) {
                    return "null";
                }
                gap += indent;
                partial = [];

                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }
                    v = partial.length === 0
                        ? "[]"
                        : gap
                            ? ("[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]")
                            : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }

                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + ((gap) ? ": " : ":") + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + ((gap) ? ": " : ":") + v);
                            }
                        }
                    }
                }
                v = partial.length === 0
                    ? "{}"
                    : gap
                        ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                        : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
        }
    }

    if (typeof JSON.stringify !== "function") {
        meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = "";
            indent = "";

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }
            } else if (typeof space === "string") {
                indent = space;
            }

            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

            return str("", { "": value });
        };
    }

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {
                var k; var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {
                j = eval("(" + text + ")");

                return typeof reviver === "function"
                    ? walk({ "": j }, "")
                    : j;
            }

            throw new SyntaxError("JSON.parse");
        };
    }
}());

// ------------- 新增：确保目录和字典文件存在，首次运行自动创建空文件 -------------
function ensureDirAndFileExist() {
    var folder = new Folder(DIR_PATH);
    if (!folder.exists) {
        if (!folder.create()) {
            alert("无法创建字典文件夹，可能没有权限，路径：" + DIR_PATH);
            return false;
        }
    }
    var fileNames = [FILE_NAME_DICT, FILE_PARAM_DICT];
    for (var i=0; i<fileNames.length; i++) {
        var f = new File(fileNames[i]);
        if (!f.exists) {
            // 写入一个空 JSON 对象文件，避免后续读取失败
            safeWriteFile(fileNames[i], "{}");
        }
    }
    return true;
}

function Zayu_ShowCustomDictWindow() {
    // 启动时检查版本日志
    Zayu_CheckVersionAndShowLog();
        // 新增：确保文件夹和字典文件存在，失败则终止UI创建
    if (!ensureDirAndFileExist()) {
        alert("无法启动插件，因为字典文件夹或文件不可用。");
        return; // 阻止后续UI初始化，避免空读写覆盖文件
    }
    // ================= UI 构建区域 =================
    var win = new Window("palette"); 
        win.text = "杂鱼-自定义汉化字典"; 
        win.orientation = "column"; 
        win.alignChildren = ["fill","top"]; 
        win.spacing = 10; 
        win.margins = 16; 

    // --- 顶部工具栏组 ---
    var ImportAndExportGroup = win.add("group", undefined, {name: "ImportAndExportGroup"}); 
        ImportAndExportGroup.orientation = "row"; 
        ImportAndExportGroup.alignChildren = ["left", "center"]; 
        ImportAndExportGroup.alignment = ["fill", "top"];        
        ImportAndExportGroup.spacing = 10; 
    
    // 1. 左侧：导入/导出
    var ImportDictionary = ImportAndExportGroup.add("button", undefined, "导入汉化字典"); 
        ImportDictionary.preferredSize.height = 30; 

    var ExportDictionary = ImportAndExportGroup.add("button", undefined, "导出汉化字典"); 
        ExportDictionary.preferredSize.height = 30; 

    // 2. 分割线
    var divider1 = ImportAndExportGroup.add("panel"); 
        divider1.preferredSize = [2, 25]; 
        divider1.enabled = false;         

    // 3. 左侧：清空按钮
    var ClearCustomDictionary = ImportAndExportGroup.add("button", undefined, undefined, {name: "ClearCustomDictionary"}); 
        ClearCustomDictionary.text = "清空本地自定义字典"; 
        ClearCustomDictionary.preferredSize.height = 30; 
        ClearCustomDictionary.helpTip = "慎用！这将删除磁盘上的两个自定义JSON文件。";

    // --- 打开教程视频按钮 ---
    var OpenHelpVideoButton = ImportAndExportGroup.add("button", undefined, "查看教程视频"); 
        OpenHelpVideoButton.preferredSize.height = 30; 

    // --- 【新增】打开编辑器按钮 ---
    var OpenEditorButton = ImportAndExportGroup.add("button", undefined, "字典编辑器");
        OpenEditorButton.preferredSize.height = 30;
        OpenEditorButton.helpTip = "打开一个独立窗口，搜索并编辑本地字典文件";

    // 4. 弹簧占位符
    var spacer = ImportAndExportGroup.add("group");
        spacer.alignment = ["fill", "fill"];

    // 5. 右侧：版本号
    var VersionText = ImportAndExportGroup.add("statictext", undefined, "Version: " + APP_VERSION);
        var g = VersionText.graphics;
        try {
            g.foregroundColor = g.newPen(g.PenType.SOLID_COLOR, [0, 1, 0, 1], 1);
            VersionText.graphics.font = ScriptUI.newFont("Microsoft YaHei", "BOLD", 14);
        } catch(e) { }

    // --- 插件名称区 ---
    var PluginNameArea = win.add("panel", undefined, undefined, {name: "PluginNameArea"}); 
        PluginNameArea.text = "插件名称区 (Name)"; 
        PluginNameArea.orientation = "column"; // 改为垂直排列
        PluginNameArea.alignChildren = ["fill", "top"]; // 横向填满
        PluginNameArea.spacing = 10; 
        PluginNameArea.margins = 10; 

    var NameTranslationTitleText = PluginNameArea.add("statictext", undefined, '插件名翻译 (格式：英文=翻译) - [0项]'); 
    var NameTranslationEditBox = PluginNameArea.add('edittext {properties: {multiline: true, scrollable: true, wantReturn: true}}'); 
        NameTranslationEditBox.preferredSize = [-1, 150]; // 宽度-1代表自动拉伸填满

    // --- 插件参数区 ---
    var PluginParameterArea = win.add("panel", undefined, undefined, {name: "PluginParameterArea"}); 
        PluginParameterArea.text = "插件参数区 (Parameter)"; 
        PluginParameterArea.orientation = "column"; // 改为垂直排列
        PluginParameterArea.alignChildren = ["fill", "top"]; // 横向填满
        PluginParameterArea.spacing = 10; 
        PluginParameterArea.margins = 10; 

    var ParameterTranslationTitle = PluginParameterArea.add("statictext", undefined, '参数名翻译 (格式：英文=翻译) - [0项]'); 
    var ParameterTranslationEditBox = PluginParameterArea.add('edittext {properties: {multiline: true, scrollable: true, wantReturn: true}}'); 
        ParameterTranslationEditBox.preferredSize = [-1, 150]; 

    // --- 底部功能区 ---
    var BottomFunctionGroup = win.add("group", undefined, {name: "BottomFunctionGroup"}); 
        BottomFunctionGroup.orientation = "column"; 
        BottomFunctionGroup.alignChildren = ["fill","center"];
        BottomFunctionGroup.spacing = 5; 

    // 第一行按钮
    var Row1 = BottomFunctionGroup.add("group");
        Row1.orientation = "row";
        Row1.alignChildren = ["fill", "center"];
    var ReadAELayerButton = Row1.add("button", undefined, "读取选中图层插件参数+插件名 (部分参数无法读取，需要手动输入 > 输入后记得点击格式化编辑框按钮)"); 
        ReadAELayerButton.preferredSize.height = 50; 
        ReadAELayerButton.alignment = ["fill", "center"];

    // 第二行按钮
    var Row2 = BottomFunctionGroup.add("group");
        Row2.orientation = "row";
        Row2.alignChildren = ["fill", "center"];
        Row2.spacing = 10;

    var FormatButton = Row2.add("button", undefined, "编辑框文本 转 翻译格式"); 
        FormatButton.preferredSize.height = 40; 

    var RemoveDupeButton = Row2.add("button", undefined, "[建议保存前使用] 去除重复的汉化"); 
        RemoveDupeButton.preferredSize.height = 40; 

    var ClearEditBoxButton = Row2.add("button", undefined, "清空上方列表"); 
        ClearEditBoxButton.preferredSize.height = 40; 

    var divider2 = win.add("panel", undefined, undefined, {name: "divider2"}); 
        divider2.alignment = "fill"; 

    var MergeFilesButton = win.add("button", undefined, "保存到本地自定义汉化字典"); 
        MergeFilesButton.preferredSize.height = 50; 
        MergeFilesButton.alignment = ["fill","center"]; 
        MergeFilesButton.graphics.font = ScriptUI.newFont("Microsoft YaHei", "BOLD", 16);


    // =========================================================
    // 逻辑功能实现 (主窗口)
    // =========================================================

    // 打开独立编辑器窗口
    OpenEditorButton.onClick = function() {
        Zayu_OpenEditorWindow();
    }

    // 辅助：更新列表项数显示
    function updateCountsLabel() {
        var countN = 0;
        if(NameTranslationEditBox.text) {
             var lines = NameTranslationEditBox.text.split("\n");
             for(var i=0; i<lines.length; i++) if(lines[i].replace(/\s/g, "") !== "") countN++;
        }
        NameTranslationTitleText.text = "插件名翻译 (格式：英文=翻译) - [" + countN + "项]";

        var countP = 0;
        if(ParameterTranslationEditBox.text) {
             var lines = ParameterTranslationEditBox.text.split("\n");
             for(var i=0; i<lines.length; i++) if(lines[i].replace(/\s/g, "") !== "") countP++;
        }
        ParameterTranslationTitle.text = "参数名翻译 (格式：英文=翻译) - [" + countP + "项]";
    }
	
    // 1. 监听插件名框 (打字时实时更新)
    NameTranslationEditBox.onChanging = updateCountsLabel;
    NameTranslationEditBox.onChange = updateCountsLabel;

    // 2. 监听参数框
    ParameterTranslationEditBox.onChanging = updateCountsLabel;
    ParameterTranslationEditBox.onChange = updateCountsLabel;

    // ===========================================

    // 打开教程视频
    OpenHelpVideoButton.onClick = function() {
        var helpFile = new File(DIR_PATH + "help.mp4");
        if (!helpFile.exists) {
            alert("未找到教程视频！\n路径：" + helpFile.fsName);
            return;
        }
        try {
            var cmd = 'cmd /c start "" "' + helpFile.fsName + '"';
            system.callSystem(cmd);
        } catch(e) {
            if(confirm("无法打开视频，可能是权限不足！\n是否打开首选项？")) app.executeCommand(3131); 
        }
    };

    // 读取 AE 图层逻辑
    ReadAELayerButton.onClick = function() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("请先选择一个合成。");
            return;
        }
        var layers = comp.selectedLayers;
        if (layers.length === 0) {
            alert("请先选择一个包含插件的图层。");
            return;
        }

        NameTranslationEditBox.text = ""; 
        ParameterTranslationEditBox.text = ""; 
        
        var pluginNames = [];
        var params = [];

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var effects = layer.property("ADBE Effect Parade");
            
            if (effects) {
                for (var j = 1; j <= effects.numProperties; j++) {
                    var effect = effects.property(j);
                    if (effect.name && effect.name !== "" && effect.name !== "<error>") {
                        pluginNames.push(effect.name);
                    }
                    for (var k = 1; k <= effect.numProperties; k++) {
                        var param = effect.property(k);
                        var pName = param.name;
                        if (pName && pName !== "" && pName.indexOf("<error>") === -1 && param.propertyType !== PropertyType.NAMED_GROUP) {
                            params.push(pName);
                        }
                    }
                }
            }
        }
        pluginNames = uniqueArray(pluginNames);
        params = uniqueArray(params);

        var nameStr = "";
        for (var n = 0; n < pluginNames.length; n++) {
            nameStr += pluginNames[n] + '=\n';
        }
        NameTranslationEditBox.text = nameStr; // 直接放入翻译框

        var paramStr = "";
        for (var p = 0; p < params.length; p++) {
            paramStr += params[p] + '=\n';
        }
        ParameterTranslationEditBox.text = paramStr; // 直接放入翻译框

        updateCountsLabel();
    };

    // 格式化编辑框文本
    FormatButton.onClick = function() {
		function smartFormatBox(sourceText) {
            if (!sourceText || sourceText.replace(/\s/g, "") === "") return "";
            var lines = sourceText.split(/\r\n|\r|\n/);
            var resultLines = [];
            
            // 匹配包含等号的情况
            var regexHasEqual = /^[^=]+?=/;

            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line.replace(/\s/g, "") === "") continue;

                if (regexHasEqual.test(line)) {
                    resultLines.push(line);
                } else {
                    // 如果发现旧的 "Key" : "Val" 格式，自动转换为 Key=Val
                    var oldMatch = line.match(/^\s*"(.+?)"\s*:\s*"(.*?)"\s*$/);
                    if (oldMatch) {
                        resultLines.push(oldMatch[1] + "=" + oldMatch[2]);
                    } else {
                        // 纯单词转成 Key=
                        var rawKey = line.replace(/^\s+|\s+$/g, "");
                        if (rawKey.charAt(0) === '"' && rawKey.charAt(rawKey.length - 1) === '"') {
                            rawKey = rawKey.substring(1, rawKey.length - 1);
                        }
                        if (rawKey !== "") {
                            resultLines.push(rawKey + "=");
                        }
                    }
                }
            }
            return resultLines.join("\n");
        }


        // 应用到两个翻译框即可
        NameTranslationEditBox.text = smartFormatBox(NameTranslationEditBox.text);
        ParameterTranslationEditBox.text = smartFormatBox(ParameterTranslationEditBox.text);
        
        // 更新计数显示
        updateCountsLabel();
    }


    // 去除重复
    RemoveDupeButton.onClick = function() {
        var nameText = NameTranslationEditBox.text;
        var paramText = ParameterTranslationEditBox.text;
        var isNameEmpty = (!nameText || nameText.replace(/\s/g, "") === "");
        var isParamEmpty = (!paramText || paramText.replace(/\s/g, "") === "");

        if (isNameEmpty && isParamEmpty) {
            alert("无内容可去重！");
            return;
        }

        var progWin = new Window("palette", "正在处理...", undefined, {closeButton: false}); 
            progWin.preferredSize = [400, 100];
            progWin.alignChildren = ["fill", "center"];
        var stStatus = progWin.add("statictext", undefined, "初始化...", {truncate: "middle"});
        var progBar = progWin.add("progressbar", undefined, 0, 100);
            progBar.preferredSize.height = 20;
        
        progWin.show();
        progWin.update(); 

        var resultMsg = null;

        try {
            var loadWithProgress = function(path, percent) {
                progBar.value = percent;
                stStatus.text = "正在读取: " + new File(path).name;
                progWin.update(); 
                $.sleep(10); 
                return readJsonFile(path);
            };

            var zyNameDict = loadWithProgress(OFFICIAL_NAME_DICT, 10);
            var customNameDict = loadWithProgress(FILE_NAME_DICT, 30);
            var replaceMapDict = loadWithProgress(OFFICIAL_PARAM_DICT, 50);
            var customParamDict = loadWithProgress(FILE_PARAM_DICT, 75);

            stStatus.text = "正在比对过滤...";
            progBar.value = 90;
            progWin.update();
            $.sleep(10);

            // 【新版单框去重过滤逻辑】
            var filterContentSingle = function(textStr, dict1, dict2) {
                if (!textStr) return { result: "", removed: 0 };
                var lines = textStr.split("\n");
                var resLines = [], removedCount = 0;

                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (!line || line.replace(/\s/g, "") === "") continue;
                    
                    var key = cleanKey(line); 
                    if (!key || key === "") continue;
                    
                    // 如果官方或本地已存在该Key，说明重复，将其剔除
                    if ((dict1 && dict1.hasOwnProperty(key)) || (dict2 && dict2.hasOwnProperty(key))) {
                        removedCount++;
                    } else {
                        resLines.push(line);
                    }
                }
                return { result: resLines.join("\n"), removed: removedCount };
            };

            var resName = filterContentSingle(nameText, zyNameDict, customNameDict);
            var resParam = filterContentSingle(paramText, replaceMapDict, customParamDict);

            if(!isNameEmpty) NameTranslationEditBox.text = resName.result;
            if(!isParamEmpty) ParameterTranslationEditBox.text = resParam.result;
            
            updateCountsLabel();
            resultMsg = "去重完成！\n插件名移除: " + resName.removed + "\n参数名移除: " + resParam.removed;
        } catch(err) {
            resultMsg = "发生错误：" + err.toString();
        } finally {
            progWin.close();
            progWin = null; 
        }
        if (resultMsg) {
            win.update(); 
            $.sleep(100); 
            alert(resultMsg);
        }
    };

    // 导出功能
    ExportDictionary.onClick = function() {
        var folder = Folder.selectDialog("请选择导出文件夹");
        if (!folder) return; 
        var fName = new File(FILE_NAME_DICT);
        var fParam = new File(FILE_PARAM_DICT);
        var count = 0;
        if (fName.exists && fName.copy(folder.fsName + "/" + FILE_NAME_DICT_NAME)) count++;
        if (fParam.exists && fParam.copy(folder.fsName + "/" + FILE_PARAM_DICT_NAME)) count++;
        if (count > 0) alert("导出成功！共导出 " + count + " 个文件。");
        else alert("本地没有找到字典文件，无法导出。");
    };

    // ===========================================
    // 【修改】导入功能 - 支持覆盖或追加合并
    // ===========================================
    ImportDictionary.onClick = function() {
        // --- 第一步：处理插件名字典 (Name) ---
        alert("步骤 1/2：请选择 [" + FILE_NAME_DICT_NAME + "]");
        var fName = File.openDialog("选择 " + FILE_NAME_DICT_NAME, "*.json");
        if (!fName) return;
        if (decodeURI(fName.name) !== FILE_NAME_DICT_NAME) { 
            alert("错误：文件名必须是 " + FILE_NAME_DICT_NAME); return; 
        }

        // 询问模式 - Name
        var modeName = "overwrite";
        if (new File(FILE_NAME_DICT).exists) {
            var confirmMsg = "检测到本地已存在插件名字典。\n\n" +
                             "【是 (Yes)】= 追加合并 (Merge)\n保留本地原有条目，将导入文件中的新条目加入，重复的条目以导入文件为准。\n\n" +
                             "【否 (No)】= 覆盖 (Overwrite)\n删除本地文件，完全替换为导入的文件。";
            if (confirm(confirmMsg, false, "导入模式选择 - 插件名")) {
                modeName = "merge";
            }
        }

        // --- 第二步：处理参数字典 (Param) ---
        alert("步骤 2/2：请选择 [" + FILE_PARAM_DICT_NAME + "]");
        var fParam = File.openDialog("选择 " + FILE_PARAM_DICT_NAME, "*.json");
        if (!fParam) return;
        if (decodeURI(fParam.name) !== FILE_PARAM_DICT_NAME) { 
            alert("错误：文件名必须是 " + FILE_PARAM_DICT_NAME); return; 
        }

        // 询问模式 - Param
        var modeParam = "overwrite";
        if (new File(FILE_PARAM_DICT).exists) {
            var confirmMsgParam = "检测到本地已存在参数字典。\n\n" +
                                  "【是 (Yes)】= 追加合并 (Merge)\n保留本地原有条目，将导入文件中的新条目加入，重复的条目以导入文件为准。\n\n" +
                                  "【否 (No)】= 覆盖 (Overwrite)\n删除本地文件，完全替换为导入的文件。";
            if (confirm(confirmMsgParam, false, "导入模式选择 - 参数")) {
                modeParam = "merge";
            }
        }

        // --- 执行处理 ---
        var resultName = Zayu_ProcessImportFile(fName, FILE_NAME_DICT, modeName);
        var resultParam = Zayu_ProcessImportFile(fParam, FILE_PARAM_DICT, modeParam);

        alert("导入完成！\n\n插件名字典: " + resultName + "\n参数字典: " + resultParam);
        
        // 如果当前编辑器开着，可能需要刷新一下（如果有刷新逻辑的话），或者提醒用户重启
    };


	// --- 6. 合并并保存 (主界面) ---
	MergeFilesButton.onClick = function() {
		// 改为匹配 Key=Value 的正则
		var REGEX_LINE = /^(.+?)=(.*)$/;

		function parseAndMerge(sourceText, targetDict) {
			if (!sourceText) return 0;
			var lines = sourceText.split(/[\r\n]+/);
			var count = 0;
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
				if (line.replace(/\s/g, "") === "") continue;
				var match = line.match(REGEX_LINE);
				if (match) {
					// 去除 Key 和 Value 两端的多余空格
					var key = match[1].replace(/^\s+|\s+$/g, "");
					var val = match[2].replace(/^\s+|\s+$/g, "");
					
					// 【修改】：增加 val !== "" 验证，如果译文为空，直接跳过不写入
					if (key !== "" && val !== "") {
						targetDict[key] = val;
						count++;
					}
				}

			}
			return count;
		}

		var localNameDict = readJsonFile(FILE_NAME_DICT); 
		if (localNameDict === null) localNameDict = {}; // 确保它是对象
		
		var countName = parseAndMerge(NameTranslationEditBox.text, localNameDict);

		var localParamDict = readJsonFile(FILE_PARAM_DICT); 
		if (localParamDict === null) localParamDict = {}; // 确保它是对象
		
		var countParam = parseAndMerge(ParameterTranslationEditBox.text, localParamDict);


		if (countName === 0 && countParam === 0) {
			alert("未检测到有效的翻译内容！\n\n请确保翻译框内的格式为：\n原文=翻译");
			return;
		}

		// 【核心修复】使用自定义序列化，代替 JSON.stringify，解决 AE 2026 乱码
		var jsonName = customStringify(localNameDict);
		var jsonParam = customStringify(localParamDict);

		var successName = safeWriteFile(FILE_NAME_DICT, jsonName);
		if(successName) {
			var successParam = safeWriteFile(FILE_PARAM_DICT, jsonParam);
			if (successParam) {
				alert("合并成功！\n\n插件名更新: " + countName + " 条\n参数更新: " + countParam + " 条");
			}
		}
	};

    ClearEditBoxButton.onClick = function() {
        NameTranslationEditBox.text = ""; 
        ParameterTranslationEditBox.text = "";
        updateCountsLabel();
    };


    ClearCustomDictionary.onClick = function() {
        if(confirm("确定清空本地自定义字典文件吗？")) {
            new File(FILE_NAME_DICT).remove(); new File(FILE_PARAM_DICT).remove();
            alert("自定义字典已清空。");
        }
    }

    win.show();
}

// =========================================================
// 修复版：字典编辑器 - 支持搜索状态下删除条目
// =========================================================
function Zayu_OpenEditorWindow() {

    // --- 0. 路径配置 ---
    var _LOCAL_DIR = "C:\\Users\\Public\\Zayu_Hook_Translation\\";
    var _FILE_NAME = _LOCAL_DIR + "ZaYu-Customplugin-name-translation.json";
    var _FILE_PARAM = _LOCAL_DIR + "ZaYu-Custom-plugin-parameter-translation.json";

    // --- 1. 数据核心 ---
    var MasterDataName = {};
    var MasterDataParam = {};
    var currentSearchKeyword = ""; 
    
    // 【新增】追踪当前搜索结果中显示的 keys
    var visibleKeysName = {};
    var visibleKeysParam = {};

    // --- 2. 工具函数 ---
    function internalReadJson(path) {
        var f = new File(path);
        if (!f.exists) return {};
        f.encoding = "UTF-8";
        if (f.open("r")) {
            var str = f.read();
            f.close();
            try { return JSON.parse(str); } catch (e) { return {}; }
        }
        return {};
    }

    // 【修改】renderText 现在会返回并记录当前可见的 keys
    function renderText(dataObj, keyword, visibleKeysRef) {
        var lines = [];
        keyword = keyword ? keyword.toLowerCase() : "";
        
        // 清空并重建可见 keys 记录
        for (var k in visibleKeysRef) delete visibleKeysRef[k];
        for (var key in dataObj) {
            if (dataObj.hasOwnProperty(key)) {
                var val = dataObj[key];
                if (keyword === "" || 
                    key.toLowerCase().indexOf(keyword) !== -1 || 
                    String(val).toLowerCase().indexOf(keyword) !== -1) {
                    lines.push('"' + key + '" : "' + val + '"');
                    visibleKeysRef[key] = true; // 记录这个 key 当前是可见的
                }
            }
        }
        return lines.join("\n");
    }

    // 【核心修改】syncText - 支持搜索状态下删除
    function syncText(textStr, dataObj, visibleKeysRef, isSearching) {
        if (!textStr) textStr = "";
        
        var lines = textStr.split(/[\r\n]+/);
        var REGEX = /^\s*"(.+?)"\s*:\s*"(.*?)"[\s,]*$/; 
        var currentKeys = {}; // 当前编辑框中存在的 keys

        // 第一遍：解析编辑框内容，更新数据
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.replace(/\s/g, "") === "") continue;

            var match = line.match(REGEX);
            if (match && match[1]) {
                dataObj[match[1]] = match[2];
                currentKeys[match[1]] = true;
            }
        }

        // 第二遍：处理删除
        if (!isSearching) {
            // 非搜索模式：删除所有不在编辑框中的 key
            for (var dbKey in dataObj) {
                if (dataObj.hasOwnProperty(dbKey) && !currentKeys[dbKey]) {
                    delete dataObj[dbKey];
                }
            }
        } else {
            // 【关键修复】搜索模式：只删除"原本在搜索结果中显示，但现在被用户删掉"的 key
            for (var visibleKey in visibleKeysRef) {
                if (visibleKeysRef.hasOwnProperty(visibleKey)) {
                    // 如果这个 key 原本在搜索结果中可见，但现在编辑框里没有了
                    if (!currentKeys[visibleKey]) {
                        delete dataObj[visibleKey]; // 从主数据中删除
                        delete visibleKeysRef[visibleKey]; // 从可见记录中也删除
                    }
                }
            }
        }
    }

    // --- 3. 初始化 ---
    MasterDataName = internalReadJson(_FILE_NAME);
    MasterDataParam = internalReadJson(_FILE_PARAM);

    // 预先生成初始文本（同时初始化 visibleKeys）
    var initialTextName = renderText(MasterDataName, "", visibleKeysName);
    var initialTextParam = renderText(MasterDataParam, "", visibleKeysParam);
    
    var countN = 0; for(var k in MasterDataName) countN++;
    var countP = 0; for(var k in MasterDataParam) countP++;

    // ================= UI 构建 =================
    var win = new Window("palette", "杂鱼-自定义汉化字典编辑器", undefined, {resizeable: false}); 
        win.orientation = "column"; 
        win.alignChildren = ["fill","top"]; 
        win.preferredSize = [600, 500];
        win.maximumSize = [600, 600];

    var btnSave = win.add("button", undefined, "保存所有修改"); 
        btnSave.preferredSize.height = 40; 

    var grpSearch = win.add("group"); 
        grpSearch.orientation = "row"; 
    grpSearch.add("statictext", undefined, "搜索关键词："); 
    var iptSearch = grpSearch.add('edittext {enterKeySignalsOnChange: true}'); 
        iptSearch.alignment = ["fill", "center"]; 
		iptSearch.preferredSize = [150, 40];
	// 清除搜索按钮
	var btnClearSearch = grpSearch.add("button", undefined, "清除搜索");
	
		btnClearSearch.preferredSize.height = 40;

	btnClearSearch.onClick = function () {
		// 先把当前编辑框的改动同步回 MasterData（此时仍处于“搜索模式”）
		syncCurrent();

		// 清空关键词并刷新列表
		iptSearch.text = "";
		currentSearchKeyword = "";

		txtName.text  = renderText(MasterDataName, "", visibleKeysName);
		txtParam.text = renderText(MasterDataParam, "", visibleKeysParam);

		// 可选：把光标放回搜索框
		try { iptSearch.active = true; } catch (e) {}
	};

	var grpContent = win.add("group");
		grpContent.alignment = ["fill","fill"];
		grpContent.orientation = "row";
		grpContent.spacing = 0;

	// 左侧：导航 + 提示（纵向）
	var navCol = grpContent.add("group");
		navCol.orientation = "column";
		navCol.alignChildren = ["fill", "top"];
		navCol.preferredSize.width = 150;
		navCol.alignment = ["left", "fill"];

	var listNav = navCol.add("listbox", undefined, [
		'插件名称 (' + countN + ')',
		'插件参数 (' + countP + ')'
	]);
		listNav.preferredSize.width = 150;
		listNav.alignment = ["fill", "fill"];

	// 底部提示：用只读 edittext 来显示多行（可选中复制，不可编辑）
	var navTipText =
		"温馨提示：\n\nAE脚本的编辑框太多翻译的时候就会有问题\n\n" +
		"如果参数太多，可以按【Ctrl+鼠标中键】打开自定义汉化窗口，可以更加方便编辑翻译内容！" 

	var navTip = navCol.add("edittext", undefined, navTipText, {
		multiline: true,
		readonly: true,
		scrollable: false,
		scrolling: false
	});
	try { navTip.scrollable = false; } catch (e) {}
	try { navTip.scrolling = false; } catch (e) {}
	navTip.preferredSize = [150, 95];
	navTip.helpTip = navTipText;

	// 尝试设置字体/颜色（注意：edittext 的颜色在某些 AE/系统上可能不生效）
	try {
		navTip.graphics.font = ScriptUI.newFont("Microsoft YaHei", "REGULAR", 11);
		navTip.graphics.foregroundColor = navTip.graphics.newPen(
			navTip.graphics.PenType.SOLID_COLOR,
			[0.9, 0.6, 0.1, 1], // RGBA，0~1
			1
		);
	} catch (e) {}



    var grpStack = grpContent.add("group"); 
        grpStack.alignment = ["fill","fill"]; 
        grpStack.orientation = "stack"; 

	var EDITOR_FONT_SIZE = 20;
	var monoFont;
	try { monoFont = ScriptUI.newFont("Microsoft YaHei", "REGULAR", EDITOR_FONT_SIZE); } catch(e){}


    // TAB 1
    var grpTabName = grpStack.add("group"); 
        grpTabName.orientation = "column"; 
        grpTabName.alignment = ["fill","fill"];var txtName = grpTabName.add('edittext', undefined, initialTextName, {multiline: true, scrollable: true});
        txtName.preferredSize.height = 400;
        txtName.alignment = ["fill","fill"];
        if(monoFont) txtName.graphics.font = monoFont;

    // TAB 2
    var grpTabParam = grpStack.add("group"); 
        grpTabParam.orientation = "column"; 
        grpTabParam.alignment = ["fill","fill"];grpTabParam.visible = false;
    var txtParam = grpTabParam.add('edittext', undefined, initialTextParam, {multiline: true, scrollable: true});
        txtParam.preferredSize.height = 400;
        txtParam.alignment = ["fill","fill"];
        if(monoFont) txtParam.graphics.font = monoFont;

    // ================= 事件 =================
	function countOwnKeys(obj) {
		var n = 0;
		for (var k in obj) if (obj.hasOwnProperty(k)) n++;
		return n;
	}

	function refreshNavCounts() {
		var cN = countOwnKeys(MasterDataName);
		var cP = countOwnKeys(MasterDataParam);

		// 记住当前选中项
		var selIndex = (listNav.selection) ? listNav.selection.index : 0;

		// 关键：重建 items，强制 listbox 重绘
		listNav.removeAll();
		listNav.add("item", "插件名称 (" + cN + ")");
		listNav.add("item", "插件参数 (" + cP + ")");
		listNav.selection = selIndex;

		try { win.layout.layout(true); } catch (e) {}
		try { win.update(); } catch (e) {}
	}


    listNav.onChange = function() {
        if (!listNav.selection) return;
        syncCurrent();
        if (listNav.selection.index === 0) {
            grpTabName.visible = true;
            grpTabParam.visible = false;
        } else {
            grpTabName.visible = false;
            grpTabParam.visible = true;
        }
    }
    listNav.selection = 0;

    // 【修改】搜索时重新渲染并更新 visibleKeys
    iptSearch.onChanging = function() {
        syncCurrent(); // 先同步当前编辑框的修改
        currentSearchKeyword = this.text;
        txtName.text = renderText(MasterDataName, currentSearchKeyword, visibleKeysName);
        txtParam.text = renderText(MasterDataParam, currentSearchKeyword, visibleKeysParam);
    }

    // 【修改】编辑框变化时传入 visibleKeys
    txtName.onChange = function() { 
        syncText(this.text, MasterDataName, visibleKeysName, (currentSearchKeyword !== "")); 
    }
    txtParam.onChange = function() { 
        syncText(this.text, MasterDataParam, visibleKeysParam, (currentSearchKeyword !== "")); 
    }

    function syncCurrent() {
        var isFilter = (currentSearchKeyword !== "");
        if (grpTabName.visible) {
            syncText(txtName.text, MasterDataName, visibleKeysName, isFilter);
        } else {
            syncText(txtParam.text, MasterDataParam, visibleKeysParam, isFilter);
        }
    }

    // 保存按钮
    btnSave.onClick = function() {
        syncCurrent(); 

        var f1 = new File(_FILE_NAME);
        var f2 = new File(_FILE_PARAM);
        f1.encoding = "UTF-8"; 
        f2.encoding = "UTF-8";
        
        try {
            if (f1.open("w") && f2.open("w")) {
                var strName = customStringify(MasterDataName);
                var strParam = customStringify(MasterDataParam);
                f1.write(strName);
                f2.write(strParam);
                f1.close(); 
                f2.close();
                
                // 保存成功后刷新计数
				refreshNavCounts();
                alert("保存成功！");
            } else {
                alert("无法写入文件，请检查权限。");
            }
        } catch(e) {
            alert("错误: " + e.toString());
        }
    }

    win.onResizing = function() { win.layout.layout(true); }
    win.center();
    win.show();
}




// ================= 辅助函数库 =================

// =========================================================
// 【核心修复】自定义 JSON 序列化函数
// 解决 AE 2026/Beta 中原生 JSON.stringify 输出乱码或空对象的问题
// =========================================================
function customStringify(obj) {
    var parts = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            // 1. 获取 key 和 value
            var k = String(key);
            var v = String(obj[key]);
            
            // 2. 转义处理：先转义反斜杠，再转义双引号
            // 必须严格按照 JSON 规范，否则读取时会报错
            k = k.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
            v = v.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
            
            // 3. 拼接一行
            parts.push('\t"' + k + '": "' + v + '"');
        }
    }
    // 4. 组合成完整 JSON 字符串
    return "{\n" + parts.join(",\n") + "\n}";
}

// =========================================================
// 【新增】导入处理逻辑核心函数
// handles: 文件对象, 目标路径字符串, 模式("merge" or "overwrite")
// =========================================================
function Zayu_ProcessImportFile(importFile, targetPath, mode) {
    try {
        var targetFile = new File(targetPath);
        
        // 模式 1: 覆盖 (Overwrite) 或 本地文件不存在
        if (mode === "overwrite" || !targetFile.exists) {
            // 确保父目录存在
            var folder = new Folder(DIR_PATH);
            if (!folder.exists) folder.create();
            
            // 直接复制 (copy会返回true/false)
            if (importFile.copy(targetPath)) {
                return "已覆盖";
            } else {
                return "覆盖失败(权限不足?)";
            }
        } 
        
        // 模式 2: 追加合并 (Merge)
        else if (mode === "merge") {
            // 1. 读取本地现有数据
            var localData = readJsonFile(targetPath);
            
            // 2. 读取导入文件数据
            var importData = readJsonFile(importFile.fsName);
            
            // 3. 合并逻辑：遍历导入的数据，写入本地对象
            // (如果key已存在，importData的值会覆盖localData的值，实现更新)
            var count = 0;
            for (var key in importData) {
                if (importData.hasOwnProperty(key)) {
                    localData[key] = importData[key];
                    count++;
                }
            }
            
            // 4. 使用你之前修复的 customStringify 进行序列化，防止中文乱码
            var mergedJson = customStringify(localData);
            
            // 5. 写入回本地
            if (safeWriteFile(targetPath, mergedJson)) {
                return "已合并";
            } else {
                return "合并写入失败";
            }
        }
    } catch(e) {
        return "错误: " + e.toString();
    }
    return "未知状态";
}


// 【修复】恢复你要求的 switch 版本日志逻辑
function Zayu_GetUpdateMessage(version) {
    switch(version) {
		case "0.1.0":
			return "！！看到这条提示的，可以下载最新的脚本安装工具，进行覆盖安装！！\n\n"+
			"更新①：将翻译格式更改为【原文=译文】结构，具体操作可看教程视频(需下载最新的脚本安装器重新覆盖安装)\n\n"+
			"更新②：通过快捷键【Ctrl+鼠标中键(默认)】可以打开独立的自定义汉化窗口，操作比字典编辑器更加方便，PR也支持！\n\n"+
			"杂鱼还推出了Win系统达芬奇的蓝宝石&BCC汉化补丁，感兴趣的可以去B站主页查看哦！"
		case "0.0.9":
			return "修复了部分电脑AE无法读取自定义汉化字典导致清空之前的翻译问题！";
		case "0.0.8":
			return "修改了一下UI";
		case "0.0.7":
			return "修复了字典编辑器在搜索过滤模式下无法删除内容的问题";
        case "0.0.6":
            return "1. 新增：独立字典编辑器 (支持搜索、实时编辑、自动保存)。\n2. 优化：主界面增加实时计数显示。\n3. 修复：AE2026合并自定已汉化文件乱码问题。";
        case "0.0.5":
            return "1. 增加去重功能。\n2. 增加格式化按钮。";
        case "0.0.4":
            return "1. 优化了文件读写权限。";
        default:
            return "版本更新！\n修复了一些已知问题并优化了体验。";
    }
}

// 版本检查函数
function Zayu_CheckVersionAndShowLog() {
    var logFile = new File(FILE_VERSION_LOG);
    var lastRecordedVersion = "";
    if (logFile.exists && logFile.open("r")) {
        logFile.encoding = "UTF-8";
        // 读取第一行或最后一行（通常只存一个版本号）
        var content = logFile.read(); 
        lastRecordedVersion = content.replace(/\s/g, ""); // 去除可能的换行符
        logFile.close();
    }
    
    // 如果记录的版本不等于当前代码版本，说明是新版第一次运行
    if (lastRecordedVersion !== APP_VERSION) {
        var msg = Zayu_GetUpdateMessage(APP_VERSION);
        alert("【插件已更新 - v" + APP_VERSION + "】\n\n" + msg);
        
        // 更新日志文件
        try { 
            if (logFile.open("w")) { 
                logFile.write(APP_VERSION); 
                logFile.close(); 
            } 
        } catch (e) { }
    }
}

// 通用工具
function safeWriteFile(filePath, content) {
    var folder = new Folder(DIR_PATH);
    if (!folder.exists) folder.create();
    var file = new File(filePath);
    file.encoding = "UTF-8";
    if (!file.open("w")) {
        alert("【错误】无法写入文件，可能权限不足或文件被占用：\n" + filePath);
        return false;
    }
    file.write(content);
    file.close();
    return true;
}

function readJsonFile(filePath) {
    var file = new File(filePath);
    if (file.exists) {
        if (file.open("r")) {
            file.encoding = "UTF-8";
            var str = file.read();
            file.close();
            
            // 【新增】如果文件是空的，直接返回空对象
            if (!str || str.replace(/\s/g, "") === "") {
                return {};
            }
            
            try {
                return JSON.parse(str);
            } catch(e) {
                // 【修改】解析失败时不阻断，提示后返回空对象以便重新生成
                alert("【提示】JSON 格式已损坏或为空：\n" + filePath + "\n\n保存时将自动为您重新生成正确的结构。");
                return {}; 
            }
        } else {
            alert("【错误】打开文件失败（权限?被占用?):\n" + filePath);
            return {};
        }
    } else {
        // 文件不存在时直接返回空对象
        return {};
    }
}


function cleanKey(rawStr) {
    if (!rawStr) return "";
    // 优先尝试按等号分割，如果没有等号则兼容旧的冒号分割
    var temp = rawStr.split("=")[0];
    if (temp === rawStr) temp = rawStr.split(":")[0]; 
    return temp.replace(/"/g, "").replace(/^\s+|\s+$/g, "");
}

function uniqueArray(arr) {
    var seen = {}; var out = [];
    for(var i=0; i<arr.length; i++) {
         if(seen[arr[i]] !== 1) { seen[arr[i]] = 1; out.push(arr[i]); }
    }
    return out;
}
