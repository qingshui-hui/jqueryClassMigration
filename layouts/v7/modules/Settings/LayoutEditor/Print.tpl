{*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.1
* ("License"); You may not use this file except in compliance with the License
* The Original Code is: vtiger CRM Open Source
* The Initial Developer of the Original Code is vtiger.
* Portions created by vtiger are Copyright (C) vtiger.
* All Rights Reserved.
 ************************************************************************************}
{* modules/Settings/LayoutEditor/views/Index.php *}

{strip}
<pre>

<h1># モジュール設定一覧</h1>

全モジュールの項目一覧をブロックごとに表示します。

{foreach item=MODULE_MODEL key=MODULE_NAME from=$MODULES}
<h2>## {$MODULE_NAME}</h2><br>

{foreach key=BLOCK_LABEL_KEY item=BLOCK_MODEL from=$MODULE_MODEL['blockModels']}

<h3>### {vtranslate($BLOCK_LABEL_KEY, $BLOCK_MODEL->module->name)}</h3><br>

{assign var=FIELDS_LIST value=$BLOCK_MODEL->getLayoutBlockActiveFields()}
{if count($FIELDS_LIST) > 0}
<table class="table table-sm table-bordered">
	<thead>
		<tr>
			<th>項目名</th>
			<th>項目タイプ</th>
			<th>typeofdata</th>
			<th>必須</th>
			<th>クイック作成</th>
			<th>一括編集</th>
			<th>関連一覧</th>
			<th>主要項目</th>
			<th>デフォルト値</th>
		</tr>
	</thead>
	<tbody>
	{foreach item=FIELD_MODEL from=$FIELDS_LIST name=fieldlist}
		<tr>
			<td>{vtranslate($FIELD_MODEL->get('label'), $BLOCK_MODEL->module->name)}</td>
			<td>{vtranslate($FIELD_MODEL->getFieldDataTypeLabel(), $QUALIFIED_MODULE)}</td>
			<td>{$FIELD_MODEL->typeofdata}</td>
			<td>{if $FIELD_MODEL->isMandatory()}〇{/if}</td>
			<td>{if $FIELD_MODEL->isQuickCreateEnabled()}〇{/if}</td>
			<td>{if $FIELD_MODEL->isMassEditable()}〇{/if}</td>
			<td>{if $FIELD_MODEL->isHeaderField()}〇{/if}</td>
			<td>{if $FIELD_MODEL->isSummaryField()}〇{/if}</td>
			<td>
				{assign var=DEFAULT_VALUE value=$FIELD_MODEL->getDefaultFieldValueToViewInV7FieldsLayOut()}
				{foreach key=DEFAULT_FIELD_NAME item=DEFAULT_FIELD_VALUE from=$DEFAULT_VALUE}
					{$DEFAULT_FIELD_VALUE}
				{/foreach}
			</td>
		</tr>
	{/foreach}
	</tbody>
</table>
{else}
なし<br>
{/if}

{/foreach}
{/foreach}

</pre>

{/strip}