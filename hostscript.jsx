// hostscript.jsx

// ================= 全局配置 =================
var APP_VERSION = "0.0.3"; 
var DIR_PATH = "C:\\Users\\Public\\Zayu_Hook_Translation\\";

// 自定义文件
var FILE_NAME_DICT_NAME = "ZaYu-Customplugin-name-translation.json"; 
var FILE_PARAM_DICT_NAME = "ZaYu-Custom-plugin-parameter-translation.json"; 
var FILE_NAME_DICT = DIR_PATH + FILE_NAME_DICT_NAME; 
var FILE_PARAM_DICT = DIR_PATH + FILE_PARAM_DICT_NAME; 

// 官方/只读文件 (用于比对去重)
var OFFICIAL_NAME_DICT = DIR_PATH + "ZyName.json";
var OFFICIAL_PARAM_DICT = DIR_PATH + "Replace_Map.json";

function Zayu_ShowCustomDictWindow() {
    
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
        ClearCustomDictionary.text = "清空本地自定义的汉化字典"; 
        ClearCustomDictionary.preferredSize.height = 30; 
        ClearCustomDictionary.helpTip = "慎用！这将删除磁盘上的两个自定义JSON文件。";

    // --- 【新增】打开教程视频按钮 ---
    var OpenHelpVideoButton = ImportAndExportGroup.add("button", undefined, "打开使用教程视频"); 
        OpenHelpVideoButton.preferredSize.height = 30; 
        OpenHelpVideoButton.helpTip = "打开本地帮助视频 (help.mp4)";

    // 4. 弹簧占位符
    var spacer = ImportAndExportGroup.add("group");
        spacer.alignment = ["fill", "fill"];

    // 5. 右侧：版本号
    var VersionText = ImportAndExportGroup.add("statictext", undefined, "Version " + APP_VERSION);
        var g = VersionText.graphics;
        try {
            g.foregroundColor = g.newPen(g.PenType.SOLID_COLOR, [0, 1, 0, 1], 1);
            VersionText.graphics.font = ScriptUI.newFont("Microsoft YaHei", "BOLD", 14);
        } catch(e) { }

    // --- 插件名称区 ---
    var PluginNameArea = win.add("panel", undefined, undefined, {name: "PluginNameArea"}); 
        PluginNameArea.text = "插件名称区 (Name)"; 
        PluginNameArea.orientation = "row"; 
        PluginNameArea.spacing = 10; 
        PluginNameArea.margins = 10; 

    // 插件名-原文
    var OriginalNameGroup = PluginNameArea.add("group", undefined, {name: "OriginalNameGroup"}); 
        OriginalNameGroup.orientation = "column"; 
        OriginalNameGroup.alignChildren = ["left","center"]; 
        OriginalNameGroup.spacing = 5;
    
    var OriginalTitleText = OriginalNameGroup.add("statictext", undefined, "原文编辑框 - [0项]"); 
        OriginalTitleText.preferredSize.width = 350; 
    var NameOriginalTextEditingBox = OriginalNameGroup.add('edittext {properties: {multiline: true, scrollable: true, wantReturn: true}}'); 
        NameOriginalTextEditingBox.preferredSize = [350, 300]; 

    // 插件名-翻译
    var NameTranslationTeam = PluginNameArea.add("group", undefined, {name: "NameTranslationTeam"}); 
        NameTranslationTeam.orientation = "column"; 
        NameTranslationTeam.alignChildren = ["left","center"]; 
        NameTranslationTeam.spacing = 5;
    var NameTranslationTitleText = NameTranslationTeam.add("statictext", undefined, '翻译编辑框 - 翻译格式必须按照 "英文原文" : "中文翻译"'); 
        NameTranslationTitleText.preferredSize.width = 350; 
    var NameTranslationEditBox = NameTranslationTeam.add('edittext {properties: {multiline: true, scrollable: true, wantReturn: true}}'); 
        NameTranslationEditBox.preferredSize = [350, 300]; 

    // --- 插件参数区 ---
    var PluginParameterArea = win.add("panel", undefined, undefined, {name: "PluginParameterArea"}); 
        PluginParameterArea.text = "插件参数区 (Parameter)"; 
        PluginParameterArea.orientation = "row"; 
        PluginParameterArea.spacing = 10; 
        PluginParameterArea.margins = 10; 

    // 参数-原文
    var ParameterOriginalTextGroup = PluginParameterArea.add("group", undefined, {name: "ParameterOriginalTextGroup"}); 
        ParameterOriginalTextGroup.orientation = "column"; 
        ParameterOriginalTextGroup.alignChildren = ["left","center"]; 
        ParameterOriginalTextGroup.spacing = 5; 
    var OriginalParameterTitleText = ParameterOriginalTextGroup.add("statictext", undefined, "原文编辑框 - [0项]"); 
        OriginalParameterTitleText.preferredSize.width = 350;
    var ParameterTextEditingBox = ParameterOriginalTextGroup.add('edittext {properties: {multiline: true, scrollable: true, wantReturn: true}}'); 
        ParameterTextEditingBox.preferredSize = [350, 400]; 

    // 参数-翻译
    var ParameterTranslationGroup = PluginParameterArea.add("group", undefined, {name: "ParameterTranslationGroup"}); 
        ParameterTranslationGroup.orientation = "column"; 
        ParameterTranslationGroup.alignChildren = ["left","center"]; 
        ParameterTranslationGroup.spacing = 5; 
    var ParameterTranslationTitle = ParameterTranslationGroup.add("statictext", undefined, '翻译编辑框 - 翻译格式必须按照 "英文原文" : "中文翻译"'); 
        ParameterTranslationTitle.preferredSize.width = 350;
    var ParameterTranslationEditBox = ParameterTranslationGroup.add('edittext {properties: {multiline: true, scrollable: true, wantReturn: true}}'); 
        ParameterTranslationEditBox.preferredSize = [350, 400]; 

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

    var FormatButton = Row2.add("button", undefined, "格式化编辑框文本"); 
        FormatButton.preferredSize.height = 40; 
        FormatButton.helpTip = "将手动粘贴的文本格式化为 \"文本\" : \"\" 的形式";

    var RemoveDupeButton = Row2.add("button", undefined, "[建议合并前使用]去除重复的汉化"); 
        RemoveDupeButton.preferredSize.height = 40; 
        RemoveDupeButton.helpTip = "比对官方字典和本地自定义字典，移除已存在的原文";

    var ClearEditBoxButton = Row2.add("button", undefined, "清空上方列表"); 
        ClearEditBoxButton.preferredSize.height = 40; 

    var divider2 = win.add("panel", undefined, undefined, {name: "divider2"}); 
        divider2.alignment = "fill"; 

    var MergeFilesButton = win.add("button", undefined, "> 合并到本地自定义汉化字典 <"); 
        MergeFilesButton.preferredSize.height = 50; 
        MergeFilesButton.alignment = ["fill","center"]; 
        MergeFilesButton.graphics.font = ScriptUI.newFont("Microsoft YaHei", "BOLD", 16);


    // =========================================================
    // 逻辑功能实现
    // =========================================================

    // --- 【新增功能】打开教程视频 ---
    OpenHelpVideoButton.onClick = function() {
        var helpFile = new File(DIR_PATH + "help.mp4");
        
        if (!helpFile.exists) {
            alert("未找到教程视频！");
            return;
        }

        // 使用 Windows CMD start 命令非阻塞打开
        // start "" "path" -> "" 是为了防止路径有空格时被误认为标题
        // 这样 AE 不会等待视频播放器关闭，避免卡死
        var cmd = 'cmd /c start "" "' + helpFile.fsName + '"';
        system.callSystem(cmd);
    };


    // --- 1. 读取 AE 图层逻辑 ---
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

        NameOriginalTextEditingBox.text = "";
        NameTranslationEditBox.text = ""; 
        ParameterTextEditingBox.text = "";
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

                        if (pName && 
                            pName !== "" && 
                            pName !== "<error>" && 
                            pName.indexOf("<error>") === -1 &&
                            param.propertyType !== PropertyType.NAMED_GROUP) {
                            
                            params.push(pName);
                        }
                    }
                }
            }
        }

        pluginNames = uniqueArray(pluginNames);
        params = uniqueArray(params);

        OriginalTitleText.text = "原文 (Key) - [" + pluginNames.length + "项]";
        OriginalParameterTitleText.text = "原文 (Key) - [" + params.length + "项]";

        var nameStr = "";
        for (var n = 0; n < pluginNames.length; n++) {
            nameStr += '"' + pluginNames[n] + '" : ""\n';
        }
        NameOriginalTextEditingBox.text = nameStr;

        var paramStr = "";
        for (var p = 0; p < params.length; p++) {
            paramStr += '"' + params[p] + '" : ""\n';
        }
        ParameterTextEditingBox.text = paramStr;
    };


    // --- 2. 格式化编辑框文本 ---
    FormatButton.onClick = function() {
        function formatText(sourceText) {
            if (!sourceText || sourceText.replace(/\s/g, "") === "") {
                return { text: "", count: 0 };
            }
            var lines = sourceText.split("\n");
            var newText = "";
            var count = 0;
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line.replace(/\s/g, "") !== "") {
                    var clean = cleanKey(line); 
                    if (clean && clean !== "") {
                        newText += '"' + clean + '" : ""\n';
                        count++;
                    }
                }
            }
            return { text: newText, count: count };
        }

        var resName = formatText(NameOriginalTextEditingBox.text);
        if (NameOriginalTextEditingBox.text !== "") {
            NameOriginalTextEditingBox.text = resName.text;
            OriginalTitleText.text = "原文 (Key) - [" + resName.count + "项]";
        }

        var resParam = formatText(ParameterTextEditingBox.text);
        if (ParameterTextEditingBox.text !== "") {
            ParameterTextEditingBox.text = resParam.text;
            OriginalParameterTitleText.text = "原文 (Key) - [" + resParam.count + "项]";
        }
    }


    // --- 3. [修复版] 去除重复的汉化对照 ---
    RemoveDupeButton.onClick = function() {
        var nameText = NameOriginalTextEditingBox.text;
        var paramText = ParameterTextEditingBox.text;
        var isNameEmpty = (!nameText || nameText.replace(/\s/g, "") === "");
        var isParamEmpty = (!paramText || paramText.replace(/\s/g, "") === "");

        if (isNameEmpty && isParamEmpty) {
            alert("无内容可去重！");
            return;
        }

        // 创建进度窗口
        var progWin = new Window("palette", "正在处理...", undefined, {closeButton: false}); 
            progWin.preferredSize = [400, 100];
            progWin.alignChildren = ["fill", "center"];
        var stStatus = progWin.add("statictext", undefined, "初始化...", {truncate: "middle"});
        var progBar = progWin.add("progressbar", undefined, 0, 100);
            progBar.preferredSize.height = 20;
        
        progWin.show();
        progWin.update(); // 强制刷新 UI

        // 结果变量
        var resultMsg = null;

        // 使用 try-catch 确保即使出错窗口也能关闭
        try {
            // 定义读取函数
            var loadWithProgress = function(path, percent) {
                progBar.value = percent;
                stStatus.text = "正在读取: " + new File(path).name;
                progWin.update(); 
                // 稍微给 UI 线程一点喘息时间，防止白屏
                $.sleep(10); 
                return readJsonFile(path);
            };

            // 模拟进度
            var zyNameDict = loadWithProgress(OFFICIAL_NAME_DICT, 10);
            var customNameDict = loadWithProgress(FILE_NAME_DICT, 30);
            var replaceMapDict = loadWithProgress(OFFICIAL_PARAM_DICT, 50);
            var customParamDict = loadWithProgress(FILE_PARAM_DICT, 75);

            stStatus.text = "正在比对过滤...";
            progBar.value = 90;
            progWin.update();
            $.sleep(10);

            // 定义过滤逻辑 (保持原有逻辑不变)
            var filterContentSync = function(keyStr, valStr, dict1, dict2) {
                if (!keyStr) return { keys: "", vals: "", removed: 0, remain: 0 };
                var kLines = keyStr.split("\n");
                // 翻译框如果没有内容，就当做全是空行
                var vLines = (valStr && valStr.replace(/\s/g, "") !== "") ? valStr.split("\n") : [];
                
                var resK = [], resV = [], removedCount = 0;

                for (var i = 0; i < kLines.length; i++) {
                    var lineKey = kLines[i];
                    if (!lineKey || lineKey.replace(/\s/g, "") === "") continue;
                    
                    var key = cleanKey(lineKey); // 提取纯Key
                    
                    // 如果在官方字典 或 自定义字典中已存在
                    if ((dict1 && dict1.hasOwnProperty(key)) || (dict2 && dict2.hasOwnProperty(key))) {
                        removedCount++;
                    } else {
                        resK.push(lineKey);
                        // 对应的翻译行，如果有就保留，没有就空
                        resV.push(vLines[i] || ""); 
                    }
                }
                return { 
                    keys: resK.join("\n"), 
                    vals: resV.join("\n"), 
                    removed: removedCount, 
                    remain: resK.length 
                };
            };

            // 执行过滤
            var resName = filterContentSync(NameOriginalTextEditingBox.text, NameTranslationEditBox.text, zyNameDict, customNameDict);
            var resParam = filterContentSync(ParameterTextEditingBox.text, ParameterTranslationEditBox.text, replaceMapDict, customParamDict);

            // 更新 UI
            if(!isNameEmpty) {
                NameOriginalTextEditingBox.text = resName.keys;
                NameTranslationEditBox.text = resName.vals;
                OriginalTitleText.text = "原文 (Key) - [" + resName.remain + "项]";
            }
            if(!isParamEmpty) {
                ParameterTextEditingBox.text = resParam.keys;
                ParameterTranslationEditBox.text = resParam.vals;
                OriginalParameterTitleText.text = "原文 (Key) - [" + resParam.remain + "项]";
            }

            // 准备结果文本
            resultMsg = "去重完成！\n插件名移除: " + resName.removed + "\n参数名移除: " + resParam.removed;

        } catch(err) {
            resultMsg = "发生错误：" + err.toString();
        } finally {
            // 【关键修改】在这里关闭窗口
            progWin.close();
            // null 是为了让 garbage collector 尽快回收
            progWin = null; 
        }

        // 【关键修改】在窗口完全关闭、对象销毁后，再弹窗
        if (resultMsg) {
            // 再次强制刷新主窗口，确保之前的 palette 消失视觉残留
            win.update(); 
            // 延时一点点确保 UI 线程空闲
            $.sleep(100); 
            alert(resultMsg);
        }
    };



    // --- 4. 导出功能 ---
    ExportDictionary.onClick = function() {
        var folder = Folder.selectDialog("请选择导出文件夹");
        if (!folder) return; 

        var fName = new File(FILE_NAME_DICT);
        var fParam = new File(FILE_PARAM_DICT);
        var count = 0;

        if (fName.exists) {
            if(fName.copy(folder.fsName + "/" + FILE_NAME_DICT_NAME)) count++;
        }
        if (fParam.exists) {
            if(fParam.copy(folder.fsName + "/" + FILE_PARAM_DICT_NAME)) count++;
        }

        if (count > 0) alert("导出成功！共导出 " + count + " 个文件。");
        else alert("本地没有找到字典文件，无法导出。");
    };


    // --- 5. 导入功能 ---
    ImportDictionary.onClick = function() {
        alert("步骤 1/2：请选择 [" + FILE_NAME_DICT_NAME + "]");
        var fName = File.openDialog("选择 " + FILE_NAME_DICT_NAME, "*.json");
        if (!fName) return;
        if (decodeURI(fName.name) !== FILE_NAME_DICT_NAME) {
            alert("错误：文件名必须是 " + FILE_NAME_DICT_NAME); return;
        }

        alert("步骤 2/2：请选择 [" + FILE_PARAM_DICT_NAME + "]");
        var fParam = File.openDialog("选择 " + FILE_PARAM_DICT_NAME, "*.json");
        if (!fParam) return;
        if (decodeURI(fParam.name) !== FILE_PARAM_DICT_NAME) {
            alert("错误：文件名必须是 " + FILE_PARAM_DICT_NAME); return;
        }

        var targetFolder = new Folder(DIR_PATH);
        if (!targetFolder.exists) targetFolder.create();
        
        var success = true;
        if (!fName.copy(FILE_NAME_DICT)) success = false;
        if (!fParam.copy(FILE_PARAM_DICT)) success = false;

        if (success) alert("导入成功！");
        else confirmPermissionAndRetry(FILE_NAME_DICT);
    };


    // --- 6. 合并并保存 ---
    MergeFilesButton.onClick = function() {
        var localNameDict = readJsonFile(FILE_NAME_DICT); 
        var uiNameKeys = NameOriginalTextEditingBox.text.split("\n");
        var uiNameVals = NameTranslationEditBox.text.split("\n");
        var countName = 0;
        for (var i = 0; i < uiNameKeys.length; i++) {
            var cleanK = cleanKey(uiNameKeys[i]);      
            var cleanV = cleanValue(uiNameVals[i]);    
            if (cleanK && cleanK !== "" && cleanV && cleanV !== "") {
                localNameDict[cleanK] = cleanV;
                countName++;
            }
        }

        var localParamDict = readJsonFile(FILE_PARAM_DICT); 
        var uiParamKeys = ParameterTextEditingBox.text.split("\n");
        var uiParamVals = ParameterTranslationEditBox.text.split("\n");
        var countParam = 0;
        for (var j = 0; j < uiParamKeys.length; j++) {
            var cleanKP = cleanKey(uiParamKeys[j]);
            var cleanVP = cleanValue(uiParamVals[j]); 
            if (cleanKP && cleanKP !== "" && cleanVP && cleanVP !== "") {
                localParamDict[cleanKP] = cleanVP;
                countParam++;
            }
        }

        var successName = safeWriteFile(FILE_NAME_DICT, JSON.stringify(localNameDict, null, 4));
        if(successName) {
            var successParam = safeWriteFile(FILE_PARAM_DICT, JSON.stringify(localParamDict, null, 4));
            if (successParam) {
                alert("合并成功！\n插件名更新: " + countName + " 条\n参数更新: " + countParam + " 条");
            }
        }
    };

    ClearEditBoxButton.onClick = function() {
        NameOriginalTextEditingBox.text = "";
        NameTranslationEditBox.text = "";
        ParameterTextEditingBox.text = "";
        ParameterTranslationEditBox.text = "";
        OriginalTitleText.text = "原文 (Key) - [0项]";
        OriginalParameterTitleText.text = "原文 (Key) - [0项]";
    };

    ClearCustomDictionary.onClick = function() {
        if(confirm("确定清空本地自定义字典文件吗？\n(官方文件汉化字典不会被删除)")) {
            new File(FILE_NAME_DICT).remove();
            new File(FILE_PARAM_DICT).remove();
            alert("自定义字典已清空。");
        }
    }

    win.show();
}

// ================= 辅助函数库 =================

function safeWriteFile(filePath, content) {
    var folder = new Folder(DIR_PATH);
    if (!folder.exists) folder.create();
    var file = new File(filePath);
    try {
        if (file.open("w")) {
            file.encoding = "UTF-8";
            file.write(content);
            file.close();
            return true;
        } else { throw new Error("Open failed"); }
    } catch (e) {
        confirmPermissionAndRetry(filePath);
        return false;
    }
}

function confirmPermissionAndRetry(filePath) {
    if(confirm("写入失败！可能需要脚本权限。\n是否打开首选项？")) app.executeCommand(3131);
}

function readJsonFile(filePath) {
    var file = new File(filePath);
    if (file.exists && file.open("r")) {
        file.encoding = "UTF-8";
        var str = file.read();
        file.close();
        try { return JSON.parse(str); } catch(e) { return {}; }
    }
    return {};
}

function cleanKey(rawStr) {
    if (!rawStr) return "";
    var temp = rawStr.split(":")[0]; 
    return temp.replace(/"/g, "").replace(/^\s+|\s+$/g, "");
}

function cleanValue(rawStr) {
    if (!rawStr) return "";
    var temp = rawStr;
    if (temp.indexOf(":") !== -1) temp = temp.substring(temp.indexOf(":") + 1);
    return temp.replace(/"/g, "").replace(/^\s+|\s+$/g, "");
}

function uniqueArray(arr) {
    var seen = {};
    var out = [];
    for(var i = 0; i < arr.length; i++) {
         var item = arr[i];
         if(seen[item] !== 1) { seen[item] = 1; out.push(item); }
    }
    return out;
}
