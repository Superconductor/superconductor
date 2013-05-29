interface IRoot {
    input width : float;
    input height : float;

    // Only show polling placee with turnout from (minTurnout, maxTurnout]
    input minTurnout : float;
    input maxTurnout : float;

    // Change color of fraudulent nodes to fraudColor
    input showFraud : float;

    // [0.0-1.0] When at 1.0, fraudulent nodes have color correspond to 
    // projected non-fradulent votes, instead of their actual value
    input showProjected : float;

    var votesUR : float;

    // If true, width as data resizes stays fixed (but height may vary); if false, width varies along with height.
    input fixWidth : int;

    // Tween value. When at 0, only shows Javascript simulation nodes; when at 1, all nodes shown as normal.
    input showJavascript : float;

    // Here in the top so we can easily read it in host code
    var totalMag : float;
}

interface Node{
    var totalMag : float;

    var minTurnout : float;
    var maxTurnout : float;

    var votesUR : int;

    var showFraud : float;
    var showProjected : float;

    var fixWidth : int;

    var showJavascript : float;

    var w : float;
    var h : float;
    var x : float;
    var rx : float;
    var y : float;
    var by : float;
}

trait tweenMagnitude{
    actions{
        loop childs{
            totalMag := fold 0 .. $-.totalMag + childs$i.totalMag;
            childs.minTurnout := minTurnout;
            childs.maxTurnout := maxTurnout;

            childs.showFraud := showFraud;
            childs.showProjected := showProjected;

            childs.fixWidth := fixWidth;

            childs.showJavascript := showJavascript;

            votesUR := fold 0 .. $-.votesUR + childs$i.votesUR;
        }
    }
}

class Root : IRoot {
    children { childs : Node; }
    attributes{
    }
    actions{
        childs.w := (fixWidth != 0) ? width : width * (totalMag / 63895164);
        // Make height a function of the current totalMag and our pre-computed
        // default totalMag
        childs.h := height * (totalMag / 63895164);
        childs.rx := width;
        childs.by := height;

        childs.minTurnout := minTurnout;
        childs.maxTurnout := maxTurnout;

        childs.showFraud := showFraud;
        childs.showProjected := showProjected;

        childs.fixWidth := fixWidth;
        childs.showJavascript := showJavascript;
        
        totalMag := childs.totalMag;
        votesUR := childs.votesUR / totalMag;
    }
}

class CountryContainer(tweenMagnitude) : Node{
    children {childs : [Node];}
    attributes{
    }
    actions{
        x := rx - w;
        y := by - h;
        
        @render fixWidth != 0 ? @RectangleOutline(x, y, w, h, rgb(0,0,0)) : 0;

        loop childs{
            childs.w := (childs$i.totalMag / totalMag) * w;
            childs.h := h;
            childs.rx := fold x .. childs$-.rx + childs$i.w;
            childs.by := y + h;
        }
    }
}

class Region(tweenMagnitude) : Node{
    children {childs : [Node];}
    attributes{
    }
    actions{
        x := rx - w;
        y := by - h;

        loop childs{

            childs.w := w;
            childs.h := (childs$i.totalMag / totalMag) * h;
            childs.rx := x + w;
            childs.by := fold y .. childs$-.by + childs$i.h;
        }
    }
}

class District(tweenMagnitude) : Node{
    children {childs : [Node];}
    attributes{
    }
    actions{
        x := rx - w;
        y := by - h;
        
        @render fixWidth != 0 ? @RectangleOutline(x, y, w, h, rgb(0,0,0)) : 0;

        loop childs{
            childs.w := (childs$i.totalMag / totalMag) * w;
            childs.h := h;
            childs.rx := fold x .. childs$-.rx + childs$i.w;
            childs.by := y + h;
        }
    }
}

class VSquare(tweenMagnitude) : Node{
    children {childs : [Node];}
    attributes{
    }
    actions{
        x := rx - w;
        y := by - h;

        loop childs{
            childs.w := w;
            childs.h := (childs$i.totalMag / totalMag) * h;
            childs.rx := x + w;
            childs.by := fold y .. childs$-.by + childs$i.h;
        }
    }
}

class HSquare(tweenMagnitude) : Node{
    children {childs : [Node];}
    attributes{
    }
    actions{
        x := rx - w;
        y := by - h;

        loop childs{
            childs.w := (childs$i.totalMag / totalMag) * w;
            childs.h := h;
            childs.rx := fold x .. childs$-.rx + childs$i.w;
            childs.by := y + h;
        }
    }
}

class PollingPlace : Node{
    attributes{
        // Total number of ballots cast in this place
        input totalVotes : int;
        // Number of ballots cast for UR
        input totalVotesUR : int;
        // Percent of votes for UR
        input urVotes : float;
        // Average of district's percent of votes for UR (e.g., projected UR vote %)
        input urVotesProjected : float;
        // Percent of registered voters who cast a ballot in this place
        input turnout : float;

        // Default color (e.g., color when % of votes for UR is 0%)
        input defColor : color;
        // UR colors (e.g., color when % of votes for UR is 100%)
        input urColor : color; // Red
        // Color to turn fraudulent nodes
        input fraudColor : color;

        // Bool-like int to let us know if this node should be rendered in our JS simulation
        input inJavascript : int;

        var calcRegularColor : color;
        var calcFraudColor: color;
        var calcProjectedColor : color;
        var calcVotesColor : color;

        var magnitude : float;
    }

    actions{
        calcProjectedColor := lerpColor(defColor, urColor, urVotesProjected);
        calcRegularColor := lerpColor(defColor, urColor, urVotes);
        calcVotesColor := turnout > 0.83f ? lerpColor(calcRegularColor, calcProjectedColor, showProjected) : calcRegularColor;
        calcFraudColor := (turnout > 0.83f) ? fraudColor : calcVotesColor;
        
        @render @Rectangle(x, y, w, h, 255*256*256*256 + lerpColor(calcVotesColor, calcFraudColor, showFraud));

        x := rx - w;
        y := by - h;

        magnitude := (turnout > minTurnout && turnout <= maxTurnout) ? totalVotes : 0;
        totalMag := (inJavascript != 0) ? magnitude : showJavascript * magnitude;
        
        // How many votes for UR does this node contribute?
        // Turn to 0 if we're not showing this bin
        // If this is a suspect polling place, interpolate between real and
        // projected values based off showProjected.
        votesUR := (turnout > minTurnout && turnout <= maxTurnout) ? 
            ((turnout > 0.83f) ? ((totalVotesUR * (1 - showProjected)) + ((totalVotes * urVotesProjected) * showProjected)) : totalVotesUR)
            : 0;
    }
    
}
