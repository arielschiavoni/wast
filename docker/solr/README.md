Configuracion de suggestion en solr:
http://www.jimleether.com/index.cfm/2013/2/20/JQuery-Autocomplete-using-Solr-and-ColdFusion
(http://docs.lucidworks.com/display/solr/Suggester)

1. Modificar solrconfig.xml.
	a. Crear un Search components que utilize las clase de SpellChecher al final de la seccion
	"Search Components"

```xml
<!-- Suggestion (Ariel's added)-->
<searchComponent class="solr.SpellCheckComponent" name="suggest">
    <lst name="spellchecker">
      <str name="name">suggest</str>
      <str name="classname">org.apache.solr.spelling.suggest.Suggester</str>
      <str name="lookupImpl">org.apache.solr.spelling.suggest.tst.TSTLookup</str>
      <!-- Alternatives to lookupImpl:
           org.apache.solr.spelling.suggest.fst.FSTLookup   [finite state automaton]
           org.apache.solr.spelling.suggest.fst.WFSTLookupFactory [weighted finite state automaton]
           org.apache.solr.spelling.suggest.jaspell.JaspellLookup [default, jaspell-based]
           org.apache.solr.spelling.suggest.tst.TSTLookup   [ternary trees]
      -->
      <str name="field">content_autosuggest</str>  <!-- the indexed field to derive suggestions from -->
      <float name="threshold">0.005</float>
      <str name="buildOnCommit">true</str>
      <!--<str name="storeDir">C:\Users\ariel\Documents\GitHub\wast\server\solr</str>-->
      <str name="queryAnalyzerFieldType">text_auto</str>
      <!--
        <str name="sourceLocation">american-english</str>
      -->
    </lst>
</searchComponent>
```


	b. Definir el request handler para que derive en el componente de search recien creado

```xml
<requestHandler class="solr.SearchHandler" name="/suggest">
    <lst name="defaults">
      <str name="df">content_autosuggest</str>
      <str name="spellcheck">true</str>
      <str name="spellcheck.dictionary">suggest</str>
      <str name="spellcheck.onlyMorePopular">true</str>
      <str name="spellcheck.count">10</str>
      <str name="spellcheck.collate">true</str>
    </lst>
    <arr name="components">
      <str>suggest</str>
    </arr>
</requestHandler>
```

2. Modificar scheme.xml
	a. Crear un field para las sugerencias

```xml
	<field indexed="true" multiValued="true" name="content_autosuggest" stored="true" type="text_auto"/>
	<copyField source="longDesc" dest="content_autosuggest"/>
```
	b. Definir el nuevo field type usado para el termino de sugerencias

```xml
	<!-- Auto Suggest Field Type -->

    <fieldType class="solr.TextField" name="text_auto">
      <analyzer type="index">
          <tokenizer class="solr.StandardTokenizerFactory"/>
          <filter class="solr.LowerCaseFilterFactory"/>
          <filter class="solr.ShingleFilterFactory" maxShingleSize="4" outputUnigrams="true" outputUnigramsIfNoShingles="false" />
      </analyzer>
      <analyzer type="query">
          <tokenizer class="solr.StandardTokenizerFactory"/>
          <filter class="solr.LowerCaseFilterFactory"/>
          <filter class="solr.StandardFilterFactory"/>
          <filter class="solr.RemoveDuplicatesTokenFilterFactory"/>
      </analyzer>
    </fieldType>
```
