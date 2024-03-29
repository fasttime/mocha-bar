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
    var skipCountLine = createCountLine(skipCount, 'skipped', 'skip');
    var bar = createElement('DIV', root);
    bar.className = 'mocha-bar';
    var barTextNode = bar.appendChild(document.createTextNode(''));
    var progressIndicator = createElement('DIV', createElement('DIV', bar));
    updateBar();
    var errors = createElement('UL', root);
    errors.className = 'errors';

    runner.on
    (
        'pass',
        function (test)
        {
            test._failed = false;
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
                var failed = obj._failed;
                if (!failed)
                {
                    obj._failed = true;
                    if (failed === false)
                        setCount(passCountLine, --passCount, 'passed');
                    setCount(failCountLine, ++failCount, 'failed');
                    updateBar();
                }
            }
            var li = createElement('LI', errors);
            li.title = err.stack || '';
            setTimeout
            (
                function ()
                {
                    li.className = 'show';
                }
            );
            var title = createElement('H3', li);
            title.textContent = obj.fullTitle();
            var pre = createElement('PRE', li);
            pre.textContent = err.message;
            root.className = 'fail';
        }
    );

    runner.on
    (
        'pending',
        function (test)
        {
            if (test.fn) // Only tests skipped with this.skip() have a defined fn property value.
            {
                setCount(skipCountLine, ++skipCount, 'skipped');
                --testCount;
                updateBar();
            }
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
        progressIndicator.style.width = (doneCount / testCount || 0) * 100 + '%';
    }
}
