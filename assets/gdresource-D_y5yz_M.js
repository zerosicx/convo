import e from"./gdshader-BSHf-0eb.js";import r from"./gdscript-BIguuW30.js";const a=Object.freeze(JSON.parse(`{"displayName":"GDResource","name":"gdresource","patterns":[{"include":"#embedded_shader"},{"include":"#embedded_gdscript"},{"include":"#comment"},{"include":"#heading"},{"include":"#key_value"}],"repository":{"comment":{"captures":{"1":{"name":"punctuation.definition.comment.gdresource"}},"match":"(;).*$\\\\n?","name":"comment.line.gdresource"},"data":{"patterns":[{"include":"#comment"},{"begin":"(?<!\\\\w)(\\\\{)\\\\s*","beginCaptures":{"1":{"name":"punctuation.definition.table.inline.gdresource"}},"end":"\\\\s*(\\\\})(?!\\\\w)","endCaptures":{"1":{"name":"punctuation.definition.table.inline.gdresource"}},"patterns":[{"include":"#key_value"},{"include":"#data"}]},{"begin":"(?<!\\\\w)(\\\\[)\\\\s*","beginCaptures":{"1":{"name":"punctuation.definition.array.gdresource"}},"end":"\\\\s*(\\\\])(?!\\\\w)","endCaptures":{"1":{"name":"punctuation.definition.array.gdresource"}},"patterns":[{"include":"#data"}]},{"begin":"\\"\\"\\"","end":"\\"\\"\\"","name":"string.quoted.triple.basic.block.gdresource","patterns":[{"match":"\\\\\\\\([btnfr\\"\\\\\\\\\\\\n/ ]|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})","name":"constant.character.escape.gdresource"},{"match":"\\\\\\\\[^btnfr/\\"\\\\\\\\\\\\n]","name":"invalid.illegal.escape.gdresource"}]},{"match":"\\"res:\\\\/\\\\/[^\\"\\\\\\\\]*(?:\\\\\\\\.[^\\"\\\\\\\\]*)*\\"","name":"support.function.any-method.gdresource"},{"match":"(?<=type=)\\"[^\\"\\\\\\\\]*(?:\\\\\\\\.[^\\"\\\\\\\\]*)*\\"","name":"support.class.library.gdresource"},{"match":"(?<=NodePath\\\\(|parent=|name=)\\"[^\\"\\\\\\\\]*(?:\\\\\\\\.[^\\"\\\\\\\\]*)*\\"","name":"constant.character.escape.gdresource"},{"begin":"\\"","end":"\\"","name":"string.quoted.double.basic.line.gdresource","patterns":[{"match":"\\\\\\\\([btnfr\\"\\\\\\\\\\\\n/ ]|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})","name":"constant.character.escape.gdresource"},{"match":"\\\\\\\\[^btnfr/\\"\\\\\\\\\\\\n]","name":"invalid.illegal.escape.gdresource"}]},{"match":"'.*?'","name":"string.quoted.single.literal.line.gdresource"},{"match":"(?<!\\\\w)(true|false)(?!\\\\w)","name":"constant.language.gdresource"},{"match":"(?<!\\\\w)([+\\\\-]?(0|([1-9]((\\\\d|_\\\\d)+)?))(?:(?:\\\\.(0|([1-9]((\\\\d|_\\\\d)+)?)))?[eE][+\\\\-]?[1-9]_?\\\\d*|(?:\\\\.[0-9_]*)))(?!\\\\w)","name":"constant.numeric.float.gdresource"},{"match":"(?<!\\\\w)((?:[+\\\\-]?(0|([1-9]((\\\\d|_\\\\d)+)?))))(?!\\\\w)","name":"constant.numeric.integer.gdresource"},{"match":"(?<!\\\\w)([+\\\\-]?inf)(?!\\\\w)","name":"constant.numeric.inf.gdresource"},{"match":"(?<!\\\\w)([+\\\\-]?nan)(?!\\\\w)","name":"constant.numeric.nan.gdresource"},{"match":"(?<!\\\\w)((?:0x(([0-9a-fA-F](([0-9a-fA-F]|_[0-9a-fA-F])+)?))))(?!\\\\w)","name":"constant.numeric.hex.gdresource"},{"match":"(?<!\\\\w)(0o[0-7](_?[0-7])*)(?!\\\\w)","name":"constant.numeric.oct.gdresource"},{"match":"(?<!\\\\w)(0b[01](_?[01])*)(?!\\\\w)","name":"constant.numeric.bin.gdresource"},{"begin":"(?<!\\\\w)(Vector2|Vector2i|Vector3|Vector3i|Color|Rect2|Rect2i|Array|Basis|Dictionary|Plane|Quat|RID|Rect3|Transform|Transform2D|Transform3D|AABB|String|Color|NodePath|Object|PoolByteArray|PoolIntArray|PoolRealArray|PoolStringArray|PoolVector2Array|PoolVector3Array|PoolColorArray|bool|int|float|StringName|Quaternion|PackedByteArray|PackedInt32Array|PackedInt64Array|PackedFloat32Array|PackedFloat64Array|PackedStringArray|PackedVector2Array|PackedVector2iArray|PackedVector3Array|PackedVector3iArray|PackedColorArray)(\\\\()\\\\s?","beginCaptures":{"1":{"name":"support.class.library.gdresource"}},"end":"\\\\s?(\\\\))","patterns":[{"include":"#key_value"},{"include":"#data"}]},{"begin":"(?<!\\\\w)(ExtResource|SubResource)(\\\\()\\\\s?","beginCaptures":{"1":{"name":"keyword.control.gdresource"}},"end":"\\\\s?(\\\\))","patterns":[{"include":"#key_value"},{"include":"#data"}]}]},"embedded_gdscript":{"begin":"(script/source) = \\"","beginCaptures":{"1":{"name":"variable.other.property.gdresource"}},"comment":"meta.embedded.block.gdscript","end":"\\"","patterns":[{"include":"source.gdscript"}]},"embedded_shader":{"begin":"(code) = \\"","beginCaptures":{"1":{"name":"variable.other.property.gdresource"}},"end":"\\"","name":"meta.embedded.block.gdshader","patterns":[{"include":"source.gdshader"}]},"heading":{"begin":"\\\\[([a-z_]*)\\\\s?","beginCaptures":{"1":{"name":"keyword.control.gdresource"}},"end":"\\\\]","patterns":[{"include":"#heading_properties"},{"include":"#data"}]},"heading_properties":{"patterns":[{"match":"(\\\\s*[A-Za-z_\\\\-][A-Za-z0-9_\\\\-]*\\\\s*=)(?=\\\\s*$)","name":"invalid.illegal.noValue.gdresource"},{"begin":"\\\\s*([A-Za-z_-][^\\\\s]*|\\".+\\"|'.+'|\\\\d+)\\\\s*(=)\\\\s*","beginCaptures":{"1":{"name":"variable.other.property.gdresource"},"2":{"name":"punctuation.definition.keyValue.gdresource"}},"end":"($|(?==)|\\\\,?|\\\\s*(?=\\\\}))","patterns":[{"include":"#data"}]}]},"key_value":{"patterns":[{"match":"(\\\\s*[A-Za-z_\\\\-][A-Za-z0-9_\\\\-]*\\\\s*=)(?=\\\\s*$)","name":"invalid.illegal.noValue.gdresource"},{"begin":"\\\\s*([A-Za-z_-][^\\\\s]*|\\".+\\"|'.+'|\\\\d+)\\\\s*(=)\\\\s*","beginCaptures":{"1":{"name":"variable.other.property.gdresource"},"2":{"name":"punctuation.definition.keyValue.gdresource"}},"end":"($|(?==)|\\\\,|\\\\s*(?=\\\\}))","patterns":[{"include":"#data"}]}]}},"scopeName":"source.gdresource","embeddedLangs":["gdshader","gdscript"]}`)),c=[...e,...r,a];export{c as default};
