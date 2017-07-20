/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2017 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* globals hobs,jQuery */
;(function (h, $) {

    'use strict';
    window.CQ.CoreComponentsIT.v1.Navigation = window.CQ.CoreComponentsIT.v1.Navigation || {};
    var c                                    = window.CQ.CoreComponentsIT.commons,
        navigation                           = window.CQ.CoreComponentsIT.v1.Navigation;

    navigation.tcExecuteBeforeTest = function (tcExecuteBeforeTest, navigationRT, pageRT) {
        return new h.TestCase('Create Sample Content', {
            execBefore: tcExecuteBeforeTest
        })
        // level 1
            .execFct(function (opts, done) {
                c.createPage(c.template, c.rootPage, 'page_1', 'page_1', done, pageRT);
            })
            .execFct(function (opts, done) {
                $.ajax({
                    url     : h.param('page_1')(),
                    method  : 'POST',
                    complete: done,
                    data    : {
                        '_charset_'             : 'UTF-8',
                        './jcr:content/navTitle': 'Page 1'
                    }
                })
            })
            // level 2
            .execFct(function (opts, done) {
                c.createPage(c.template, h.param('page_1')(), 'page_1_1', 'page_1_1', done, pageRT);
            })
            .execFct(function (opts, done) {
                $.ajax({
                    url     : h.param('page_1_1')(),
                    method  : 'POST',
                    complete: done,
                    data    : {
                        '_charset_'             : 'UTF-8',
                        './jcr:content/navTitle': 'Page 1.1',
                        './jcr:content/sling:vanityPath': '/page_1_1_vanity'
                    }
                })
            })
            // level 2 1
            .execFct(function (opts, done) {
                c.createPage(c.template, h.param('page_1_1')(), 'page_1_1_1', 'page_1_1_1', done, pageRT);
            })
            .execFct(function (opts, done) {
                $.ajax({
                    url     : h.param('page_1_1_1')(),
                    method  : 'POST',
                    complete: done,
                    data    : {
                        '_charset_'             : 'UTF-8',
                        './jcr:content/navTitle': 'Page 1.1.1'
                    }
                })
            })
            // level 2 2
            .execFct(function (opts, done) {
                c.createPage(c.template, h.param('page_1_1')(), 'page_1_1_2', 'page_1_1_2', done, pageRT);
            })
            .execFct(function (opts, done) {
                $.ajax({
                    url     : h.param('page_1_1_2')(),
                    method  : 'POST',
                    complete: done,
                    data    : {
                        '_charset_'              : 'UTF-8',
                        './jcr:content/hideInNav': true
                    }
                })
            })
            // level 2 3
            .execFct(function (opts, done) {
                c.createPage(c.template, h.param('page_1_1')(), 'page_1_1_3', 'page_1_1_3', done, pageRT);
            })
            .execFct(function (opts, done) {
                $.ajax({
                    url     : h.param('page_1_1_3')(),
                    method  : 'POST',
                    complete: done,
                    data    : {
                        '_charset_'             : 'UTF-8',
                        './jcr:content/navTitle': 'Page 1.1.3'
                    }
                })
            })
            // add component
            .execFct(function (opts, done) {
                c.addComponent(navigationRT, h.param("page_1_1")(opts) + c.relParentCompPath, 'cmpPath', done);
            })
            .navigateTo("/editor.html%page_1_1%.html");
    };

    navigation.tcExecuteAfterTest = function (tcExecuteAfterTest) {
        return new TestCase('Clean up after test', {
            execAfter: tcExecuteAfterTest
        }).execFct(function (opts, done) {
            c.deletePage(h.param('page_1')(opts), done);
        });
    };

    navigation.testDefaultConfiguration = function (tcExecuteBeforeTest, tcExecuteAfterTest) {
        return new TestCase('Test default configuration', {
            execBefore: tcExecuteBeforeTest,
            execAfter : tcExecuteAfterTest
        })
            .execTestCase(c.tcOpenConfigureDialog('cmpPath'))
            .assert.isTrue(function () {
                return h.find('coral-checkbox.cmp-navigation__editor-collect').prop('checked') === true;
            })
            .assert.visible('.cmp-navigation__editor-maxDepth', false)
            .fillInput('foundation-autocomplete[name="./siteRoot"]', '%page_1%')
            .execTestCase(c.tcSaveConfigureDialog)
            .config.changeContext(c.getContentFrame)
            .assert.exist(
                '.cmp-navigation__list-item.cmp-navigation__list-item--level-0.cmp-navigation__list-item--active:contains("Page 1")')
            .assert.exist(
                '.cmp-navigation__list-item.cmp-navigation__list-item--level-1.cmp-navigation__list-item--active:contains("Page 1.1")')
            .assert.exist('a.cmp-navigation__list-item-link[href$="/page_1_1_vanity"]')
            .assert.exist('.cmp-navigation__list-item.cmp-navigation__list-item--level-2:contains("Page 1.1.1")')
            .assert.exist('.cmp-navigation__list-item.cmp-navigation__list-item--level-2:contains("Page 1.1.2")', false)
            .assert.exist('.cmp-navigation__list-item.cmp-navigation__list-item--level-2:contains("Page 1.1.3")');
    };

    navigation.testChangeMaxDepthLevel = function (tcExecuteBeforeTest, tcExecuteAfterTest) {
        return new TestCase('Change max depth level', {
            execBefore: tcExecuteBeforeTest,
            execAfter : tcExecuteAfterTest
        })
            .execTestCase(c.tcOpenConfigureDialog('cmpPath'))
            .fillInput('foundation-autocomplete[name="./siteRoot"]', '%page_1%')
            // uncheck
            .click('coral-checkbox.cmp-navigation__editor-collect')
            .fillInput('coral-numberinput[name="./maxDepth"]', "1")
            .execTestCase(c.tcSaveConfigureDialog)
            .config.changeContext(c.getContentFrame)
            .assert.exist(
                '.cmp-navigation__list-item.cmp-navigation__list-item--level-0.cmp-navigation__list-item--active:contains("Page 1")')
            .assert.exist(
                '.cmp-navigation__list-item.cmp-navigation__list-item--level-1.cmp-navigation__list-item--active:contains("Page 1.1")')
            .assert.exist('.cmp-navigation__list-item.cmp-navigation__list-item--level-2:contains("Page 1.1.1")', false)
            .assert.exist('.cmp-navigation__list-item.cmp-navigation__list-item--level-2:contains("Page 1.1.2")', false)
            .assert.exist('.cmp-navigation__list-item.cmp-navigation__list-item--level-2:contains("Page 1.1.3")', false);
    };

    navigation.testMaxDepthAndStartLevel = function (tcExecuteBeforeTest, tcExecuteAfterTest) {
        return new TestCase('Check maxDepth and startLevel', {
            execBefore: tcExecuteBeforeTest,
            execAfter : tcExecuteAfterTest
        })
            .execTestCase(c.tcOpenConfigureDialog('cmpPath'))
            .fillInput('foundation-autocomplete[name="./siteRoot"]', '%page_1%')
            .fillInput('coral-numberinput[name="./startLevel"]', "2")
            // uncheck
            .click('coral-checkbox.cmp-navigation__editor-collect')
            .fillInput('coral-numberinput[name="./maxDepth"]', "1")
            .execTestCase(c.tcSaveConfigureDialog)
            .assert.isTrue(function () {
                return h.find('coral-numberinput[name="./maxDepth"]').prop('invalid') === true;
            });
    };

}(hobs, jQuery));
