/* eslint-env browser */

'use strict';

function MochaBar(runner)
{
    var totalCount = runner.total;
    var testCount = countTests(runner.suite);
    var passCount = 0;
    var failCount = 0;
    var skipCount = totalCount - testCount;
    var root = document.getElementById('mocha');
    if (!root)
    {
        root = createElement('DIV', document.body);
        root.id = 'mocha';
    }
    var countList = createElement('UL', root);
    countList.className = 'count';
    var passCountLine = createCountLine(0, 'passed', 'pass');
    var failCountLine = createCountLine(0, 'failed', 'fail');
    if (skipCount)
        createCountLine(skipCount, 'skipped', 'skip');
    var bar = createElement('DIV', root);
    bar.className = 'mocha-bar';
    var barTextNode = bar.appendChild(document.createTextNode('0/' + testCount));
    var progressIndicator = createElement('DIV', createElement('DIV', bar));
    var errors = createElement('UL', root);
    errors.className = 'errors';

    runner.on
    (
        'pass',
        function ()
        {
            setCount(passCountLine, ++passCount, 'passed');
            updateBar();
        }
    );

    runner.on
    (
        'fail',
        function (obj, err)
        {
            if (obj.type === 'test' && obj.state === 'failed')
            {
                setCount(failCountLine, ++failCount, 'failed');
                updateBar();
            }
            var li = createElement('LI', errors);
            setTimeout
            (
                function ()
                {
                    li.className = 'show';
                }
            );
            var title = createElement('H3', li);
            title.textContent = obj.fullTitle();
            var p = createElement('P', li);
            p.textContent = err.message;
            root.className = 'fail';
        }
    );

    function countOnlyTests(suite)
    {
        var count = suite._onlyTests.length;
        if (count)
            return count;
        suite._onlySuites.forEach
        (
            function (suite)
            {
                count += countTests(suite);
                suite._only = true;
            }
        );
        suite.suites.forEach
        (
            function (suite)
            {
                if (!suite.pending && !suite._only)
                    count += countOnlyTests(suite);
                delete suite._only;
            }
        );
        return count;
    }

    function countTests(suite)
    {
        var count;
        if (hasOnlies(suite))
            count = countOnlyTests(suite);
        else
        {
            count = 0;
            suite.tests.forEach
            (
                function (test)
                {
                    if (!test.pending)
                        ++count;
                }
            );
            suite.suites.forEach
            (
                function (suite)
                {
                    if (!suite.pending)
                        count += countTests(suite);
                }
            );
        }
        return count;
    }

    function createCountLine(count, predicate, className)
    {
        var countLine = createElement('LI', countList);
        countLine.className = className;
        setCount(countLine, count, predicate);
        return countLine;
    }

    function createElement(tagName, parentNode)
    {
        var element = parentNode.appendChild(document.createElement(tagName));
        return element;
    }

    function hasOnlies(suite)
    {
        var result =
        suite._onlyTests.length || suite._onlySuites.length || suite.suites.some(hasOnlies);
        return result;
    }

    function setCount(countLine, count, predicate)
    {
        countLine.textContent = count + (count === 1 ? ' test ' : ' tests ') + predicate;
    }

    function updateBar()
    {
        var doneCount = passCount + failCount;
        barTextNode.textContent = doneCount + '/' + testCount;
        progressIndicator.style.width = doneCount / testCount * 100 + '%';
    }
}
