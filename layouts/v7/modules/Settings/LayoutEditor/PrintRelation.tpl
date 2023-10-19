{*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.1
* ("License"); You may not use this file except in compliance with the License
* The Original Code is: vtiger CRM Open Source
* The Initial Developer of the Original Code is vtiger.
* Portions created by vtiger are Copyright (C) vtiger.
* All Rights Reserved.
 ************************************************************************************}
{* modules/Settings/LayoutEditor/views/Index.php *}

<pre>
# 関連設定一覧

1対1と多対1の関連の場合、括弧()内はフィールド名を表します。
1対多と多対多の関連の場合、括弧()内は親モジュール名を表します。

{foreach item=MODULE key=MODULE_NAME from=$MODULES}

## {$MODULE_NAME}
{* ### 1対1と多対1の関連 *}
{foreach item=RELATION_FIELD key=FIELD_NAME from=$MODULE['RELATION_FIELDS']}
{strip}
	{assign var=REFERENCE_LIST value=$RELATION_FIELD->getReferenceList()}
	{foreach item=REFERENCE_MODULE from=$REFERENCE_LIST}
		{"- "}
		{if $RELATION_FIELD->get('_relationType') eq Settings_LayoutEditor_Module_Model::MANY_TO_ONE}
			多対1
		{else}
			1対1
		{/if}
		{' '}{vtranslate($REFERENCE_MODULE,$REFERENCE_MODULE)}
		{' ('}{vtranslate($RELATION_FIELD->get('label'),$SELECTED_MODULE_NAME)}{')'}
		{"\n"}
	{/foreach}
{/strip}
{/foreach}
{* ### 1対多と多対多の関連 *}
{foreach item=MODULE_MODEL from=$MODULE['RELATED_MODULES']}
{strip}
	{if $MODULE_MODEL->isActive()}
		{"- "}
		{if $MODULE_MODEL->get('relationtype') eq '1:N' and $MODULE_MODEL->getRelationModuleName() neq 'Calendar'}
			1対多
		{else}
			多対多
		{/if}
		{' '}{vtranslate($MODULE_MODEL->get('label'), $MODULE_MODEL->getRelationModuleName())}
		{' ('}{vtranslate($MODULE_MODEL->getRelationModuleName(),$MODULE_MODEL->getRelationModuleName())}{')'}
		{"\n"}
	{/if}
{/strip}
{/foreach}

{/foreach}
</pre>
