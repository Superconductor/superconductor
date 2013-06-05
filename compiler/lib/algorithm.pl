
set_prolog_stack(global, limit(2*10**9)).
/**
HELPERS
**/

subsetManual([], []).
subsetManual([E|NTail], [E|Tail]):-
  subsetManual(NTail, Tail).
subsetManual(NTail, [_|Tail]):-
  subsetManual(NTail, Tail).
  
  
classNode(C, [self, A, C]) :- classAttribute(C, A).
classNode(C, [self, A, C]) :- classField(C, A).
classNode(C, [self, A, C]) :- class(C, I), interfaceAttribute(I, A).
classNode(C, [self, A, C]) :- class(C, I), interfaceField(I, A).
classNode(C, [N, A, I]) :- classChild(C, N, I), interfaceAttribute(I, A).
classNode(C, [N, A, I]) :- classChild(C, N, I), interfaceField(I, A).
  
directEdge(C, [N, A, X], [M, B, Y]) :- 
  assignment(C, M, B, N, A),
  classNode(C, [N, A, X]),
  classNode(C, [M, B, Y]).

sourceInterfacesSelf(C, A) :- class(C, I), interfaceField(I, A).
sourcesInterfacesSelf(L) :-   findall([C, [self, A, C]], sourceInterfacesSelf(C, A), L).
sourceInterfacesChild(C, N, A, I) :- classChild(C, N, I), interfaceField(I, A).
sourcesInterfacesChild(L) :- findall([C, [N, A, I]], sourceInterfacesChild(C, N, A, I), L).
sourcesInterfaces(L) :- sourcesInterfacesSelf(X), sourcesInterfacesChild(Y), append(X, Y, L).
  
sourcesClasses(F) :- findall([C, [self, A, C]], classField(C, A), F).

sources(F) :- sourcesInterfaces(I), sourcesClasses(C), append(I, C, F), !.

setSame(S1, S2) :- subset(S1, S2), subset(S2, S1).

/**
Scheduling Helper: internalStep
**/


%%given ready nodes, follow to fixedpoint without leaving
hasMissingDependency(C, N, Ready1, Ready2) :- 
    directEdge(C, M, N), 
    \+ member([C, M], Ready1),
    \+ member([C, M], Ready2).
needToAddNodeSub([C, N], Prev, SoFarVisit, Classes) :-
  member(C, Classes),
  directEdge(C, _, N),
  (\+ member([C, N], Prev),
  \+ member([C, N], SoFarVisit),
  \+ hasMissingDependency(C, N, Prev, SoFarVisit)).

internalStepHSub(Prev, SoFar, Closure, Classes) :-
    ((setof(N, needToAddNodeSub(N, Prev, SoFar, Classes), Closure1), \+ Closure1 = [])
     -> (append(SoFar, Closure1, Closure2), internalStepHSub(Prev, Closure2, Closure, Classes)))
 ; SoFar = Closure.


internalStepSub(Prev, Visit, Classes) :- internalStepHSub(Prev, [], Visit, Classes).
internalStep(Prev, Visit) :- 
  findall(C, class(C, _), Classes),
  internalStepSub(Prev, Visit, Classes).


/**
Schedule Helper: FTL
**/

classDoesNotDefine(C, [C, V]) :- class(C, _), classNode(C, V), \+ directEdge(C, _, V).
classDoesDefine(C, [I, A], [C, V]) :- % self public
  class(C, I), interfaceAttribute(I, A), V = [self, A, C], directEdge(C, _, V).
classDoesDefine(C, [I, A], [C, V]) :- % child public
  V = [Lbl, A, I], classChild(C, Lbl, I), directEdge(C, _, V).

/**
Parallel Scheduling
**/

missingPublicAttribAssignmentSub([I, A], Ready, Classes) :- %as a self
  member(C, Classes),
  class(C, I), directEdge(C, M, [self, A, C]), \+ member([C, M], Ready).
missingPublicAttribAssignmentSub([I, A], Ready, Classes) :- %as a child
  member(C, Classes),
  classChild(C, N, I), 
  directEdge(C, M, [N, A, I]),
  \+ member([C, M], Ready).
correctButMissingCandidateSub(N, Ready, SupersetCandidates, Classes) :-
  member(N, SupersetCandidates),
  \+ missingPublicAttribAssignmentSub(N, Ready, Classes).
filterCandidatesSub(Ready, SupersetCandidates, [], Candidates, Classes) :-
    setof(
        N,  
        correctButMissingCandidateSub(N, Ready, SupersetCandidates, Classes),
        Candidates),
    \+ Candidates = [].
filterCandidates(Ready, SupersetCandidates, [], Candidates) :-    
  findall(C, class(C,_), Classes),
  filterCandidatesSub(Ready, SupersetCandidates, [], Candidates, Classes).

 
%%%
% Any interface (or private class) attribute that has not been fully solved
% TODO condense this + above helpers
%%%
%%%%FIXME this means C,A are in I,A...
missingPrivateCandidate([C, A], Prev) :- %missing as self class
  classAttribute(C, A), V = [self, A, C],
  directEdge(C, _, V),
  \+ member([C, V], Prev).
missingCandidate([C,A], Prev) :-  %missing as private class field
  missingPrivateCandidate([C, A], Prev).
missingCandidate([I, A], Prev) :- %missing as child interface
  interfaceAttribute(I, A), V = [_, A, I],
  directEdge(C, _, V),
  \+ member([C, V], Prev).
missingCandidate([I, A], Prev) :- %missing as self class
  interfaceAttribute(I, A), class(C, I), V = [self, A, C],
  directEdge(C, _, V),
  \+ member([C, V], Prev).

supersetCandidatesH(Prev, [], Candidates) :-
    setof(N, missingCandidate(N, Prev), Candidates).



%%%
% Topdown: self attributes class graph will assume (given candidates)
%%%
topDownMissingAssumeSub(N, Candidates, Prev, Classes) :-
  member(C, Classes),
  N = [C, [self, A, C]], member([I, A], Candidates), class(C, I),
  \+ member(N, Prev), 
  classDoesNotDefine(C, N).
topDownAssumeSub(Candidates, Prev, [], Closure, Classes) :-
  findall(N, topDownMissingAssumeSub(N, Candidates, Prev, Classes), Closure). 
topDownAssume(Candidates, Prev, [], Closure) :-
  findall(C, class(C,_), Classes),
  topDownAssumeSub(Candidates, Prev, [], Closure, Classes).



%%%
% Node's child attributes solved by visiting its children
%%
topDownMissingPostAssume(N, Candidates) :-
  N = [C, [Lbl, A, I]], member([I, A], Candidates), classChild(C, Lbl, I),
  classDoesNotDefine(C, N).

topDownPostAssume(Candidates, [], Closure) :-
    findall(N, topDownMissingPostAssume(N, Candidates), Closure).

%%%
% TopDown: whittle down Candidates until correct 
% (succeed+cut or reject/filter/retry)
%%%
topDownH(Prev, Candidates, Visit, Assume) :-
  topDownAssume(Candidates, Prev, [], PreAssume),
  append(PreAssume, Prev, ReadyBefore),
  internalStep(ReadyBefore, VisitAttempt),
  topDownPostAssume(Candidates, [], PostAssume),
  append(ReadyBefore, VisitAttempt, ReadyAfter1),
  filterCandidates(ReadyAfter1, Candidates, [], Filtered),
  %append(ReadyAfter1, PostAssume, ReadyAfter),
  append(PreAssume, PostAssume, Assumed),
  ( (setSame(Candidates,Filtered) -> (Visit = VisitAttempt, Assume = Assumed)
   ; topDownH(Prev, Filtered, Visit, Assume))).

topDown(Prev, Visit, Assume) :- % NowReady + Visit is all we can assume added 
  supersetCandidatesH(Prev, [], Candidates),
  topDownH(Prev, Candidates, Visit, Assume),
  Visit \= [].


%%%
% BottomUp: child interface attributes class graph will assume (given candidates)
%%%
bottomUpMissingAssumeSub(N, Candidates, Prev, Classes) :-
  member(C, Classes),
  N = [C, [Lbl, A, I]], member([I, A], Candidates), classChild(C, Lbl, I), interfaceAttribute(I, A),
  \+ member(N, Prev),
  classDoesNotDefine(C, N).
bottomUpAssumeSub(Candidates, Prev, [], Closure, Classes) :-
  findall(N,  bottomUpMissingAssumeSub(N, Candidates, Prev, Classes), Closure).
bottomUpAssume(Candidates, Prev, [], Closure) :-
    findall(C, class(C, _), Classes),
    bottomUpAssumeSub(Candidates, Prev, [], Closure, Classes).

%%%
% Node's self attributes solved by visiting its parent (all)
%%
bottomUpMissingPostAssumeSub(N, Candidates, Prev, Classes) :-
  member(C, Classes),
  N = [C, [self, A, C]], class(C, I), interfaceAttribute(I, A),  member([I, A], Candidates),
  \+ member(N, Prev),
  classDoesNotDefine(C, N).
bottomUpPostAssumeSub(Candidates, Prev, [], Closure, Classes) :-
    findall(N, bottomUpMissingPostAssumeSub(N, Candidates, Prev, Classes), Closure).
bottomUpPostAssume(Candidates, Prev, [], Closure) :-
    findall(C, class(C, _), Classes), 
    bottomUpPostAssumeSub(Candidates, Prev, [], Closure, Classes).

%%%
% BottomUp: whittle down Candidates until correct 
% (succeed+cut or reject/filter/retry)
% TODO refactor to share more with TopDown
%%%
bottomUpH(Prev, Candidates, Visit, Assume) :-
  bottomUpAssume(Candidates, Prev, [], PreAssume),
  %candidateRequires(Candidates, Prev, [], Require),
  append(PreAssume, Prev, ReadyBefore),
  internalStep(ReadyBefore, VisitAttempt),
  bottomUpPostAssume(Candidates, Prev, [], PostAssume),
  append(ReadyBefore, VisitAttempt, ReadyAfter1),
  filterCandidates(ReadyAfter1, Candidates, [], Filtered),
  append(PreAssume, PostAssume, Assumed),
  ( (setSame(Candidates,Filtered) -> (Visit = VisitAttempt, Assume = Assumed)
   ; bottomUpH(Prev, Filtered, Visit, Assume))).

bottomUp(Prev, Visit, NowReady) :- % NowReady + Visit is all we can assume added
  supersetCandidatesH(Prev, [], Candidates),
  bottomUpH(Prev, Candidates, Visit, NowReady),
  Visit \= [].

%%%
% tdltru: whittle down Candidates until correct 
% (succeed+cut or reject/filter/retry)
% FIXME currently assumes child order is specified -- support ordering non-determinism?
%%%

numChildren(C,N) :- findall(Lbl, classChild(C, Lbl, _), L), length(L, N).
maxChildren(N) :- findall(N1, (class(C,_),numChildren(C, N1)), L), max_list(L, N).

isNth(O, C, N, Nth) :- 
  member( (C, CO), O), nth1(Nth, CO, N).
tdltruMissingAssumeSub(O, Nth, N, BUCandidates, Classes, Prev) :-
  member(C, Classes),
  isNth(O, C, Lbl, Nth),
  N = [C, [Lbl, A, I]], member([I, A], BUCandidates), classChild(C, Lbl, I),
  \+ member(N, Prev),
  classDoesNotDefine(C, N).
tdltruHChildrenStepAssumeSub(O, Nth, BUCandidates, Classes, Prev, [], Closure) :-
  findall(N,  tdltruMissingAssumeSub(O, Nth, N, BUCandidates, Classes, Prev), Closure).

% for each TDCandid
%   if all internal instances for Nth are ready / prev, included in filteredtd
unreadyAtNthChildSub(O, [I, A], PrevBeforeStep, Nth, Classes) :-
  member(C, Classes),
  isNth(O, C, N, Nth),
  classChild(C, N, I), 
  directEdge(C, M, [N, A, I]), 
  \+ member([C, M], PrevBeforeStep).
  %\+ member([C, [N, A, I]], PrevBeforeStep).  

% for each TDCandid
%   record which TDCandids had a missing dep
%tdltruMissingInvalidChildAssume(O, N, PrevBeforeStep, TDCandidates, Nth) :-
%  member(N, TDCandidates),
%  unreadyAtNthChild(O, N, PrevBeforeStep, Nth).
%invalidTdltruChildAssume(O, PrevBeforeStep, TDCandidates, Nth, [], Closure) :-
%    findall(N, tdltruMissingInvalidChildAssume(O, N, PrevBeforeStep, TDCandidates, Nth), Closure).
tdltruMissingInvalidChildAssumeSub(O, N, PrevBeforeStep, TDCandidates, Nth, Classes) :-
  member(N, TDCandidates),
  unreadyAtNthChildSub(O, N, PrevBeforeStep, Nth, Classes).
invalidTdltruChildAssumeSub(O, PrevBeforeStep, TDCandidates, Nth, [], Closure, Classes) :-
  findall(N, tdltruMissingInvalidChildAssumeSub(O, N, PrevBeforeStep, TDCandidates, Nth, Classes), Closure).

tdltruHChildrenStepSub(O, ReadyAfterStart, TDCandidates, BUCandidates, _, InorderClasses,
    ChildrenVisitsPrev, Visit, ChildrenReadyAftersPrev, Assume, Nth, InvalidTDs, GoodTDCandids) :-
  maxChildren(M), succ(M, MPlus1), Nth < MPlus1, 
  % internal step by adding assumptions of Nth child
  append(ReadyAfterStart, ChildrenVisitsPrev, Prev1),
  append(Prev1, ChildrenReadyAftersPrev, PrevBeforeStep),
  %record violation and continue -- later filtering takes into account
  %  (... don't short circuit because some future progress still might be legit)
  invalidTdltruChildAssumeSub(O, PrevBeforeStep, TDCandidates, Nth, [], InvalidTDs, InorderClasses),
  tdltruHChildrenStepAssumeSub(O, Nth, BUCandidates, InorderClasses, PrevBeforeStep, [], Assume),
  append(Assume, PrevBeforeStep, ReadyBefore),
  internalStepSub(ReadyBefore, Visit, InorderClasses),
  ((InvalidTDs = [] -> GoodTDCandids=true); GoodTDCandids=false).

%  a. require internal child.TD attribs before iteration step 
%    (exit early with filtered on failure)
%  b. assume external child.BU after iteration step
%starts at 1
tdltruHChildrenSub(O, Ready, TDCandids, BUCandids, BUClasses, InorderClasses,
  ChildrenVisitsPrev, CVClosure, ChildrenReadyAftersPrev, CRAClosure, SoFar, InvalidChildTDs, InvalidChildTDsC, COP, COC) :-
  (tdltruHChildrenStepSub(O, Ready, TDCandids, BUCandids, BUClasses, InorderClasses, ChildrenVisitsPrev, ChildrenVisitsNext, ChildrenReadyAftersPrev, ChildrenReadyAftersNext, SoFar, InvalidChildrenTDsStep, _)
   -> (succ(SoFar, SoFarPlus1),
       append(InvalidChildTDs, InvalidChildrenTDsStep, InvalidChildTDsNext), 
       append(ChildrenVisitsPrev, ChildrenVisitsNext, ChildrenVisits),
       append(COP, [SoFar | ChildrenVisitsNext], ChildrenVisitsO),
       append(ChildrenReadyAftersPrev, ChildrenReadyAftersNext, ChildrenReadyAfters),
       tdltruHChildrenSub(O, Ready, TDCandids, BUCandids, BUClasses, InorderClasses, ChildrenVisits, CVClosure, ChildrenReadyAfters, CRAClosure, SoFarPlus1, InvalidChildTDsNext, InvalidChildTDsC, ChildrenVisitsO, COC)))
  ; (ChildrenVisitsPrev = CVClosure, ChildrenReadyAftersPrev = CRAClosure, InvalidChildTDs = InvalidChildTDsC, COP = COC).

tdltruAttemptTrySub(O, Prev, TDCandids, BUCandids, BUClasses, InorderClasses, Visit, VO, InvalidChildTDs, ReadyAfter, InorderParent) :-  
  (InorderParent -> %can assume parent visited beforehand
   (topDownAssumeSub(TDCandids, Prev, [], AssumeTD, InorderClasses),
    append(AssumeTD, Prev, ReadyBefore))
   ; ReadyBefore = Prev),
  internalStepSub(ReadyBefore, StartVisit, InorderClasses),
  append(ReadyBefore, StartVisit, ReadyAfterStart),
  tdltruHChildrenSub(O, ReadyAfterStart, TDCandids, BUCandids, BUClasses, InorderClasses, [], ChildVisits, [], ChildrenReadyAfters, 1, [], InvalidChildTDs, [], ChildVisitsO),
  append(ReadyAfterStart, ChildVisits, ReadyAfter1),  
  append(ReadyAfter1, ChildrenReadyAfters, ReadyAfter),
  append(StartVisit, ChildVisits, Visit),
  append(StartVisit, ChildVisitsO, VO).
    
tdltruAttemptFilterSub(O, Prev, TDCandids, BUCandids, BUClasses, InorderClasses, VisitAttempt, VAO, InvalidChildTDs, ReadyAfter,   Visit, TDC, BUC, VO, InorderParent) :-
  filterCandidatesSub(ReadyAfter, TDCandids, [], FilteredTD, InorderClasses),
  filterCandidatesSub(ReadyAfter, BUCandids, [], FilteredBU, InorderClasses),
  subtract(FilteredTD,InvalidChildTDs, BothFilteredTD),
  ((setSame(BothFilteredTD, TDCandids), setSame(FilteredBU, BUCandids)) ->
    (TDC = TDCandids, BUC = BUCandids, Visit = VisitAttempt, VO = VAO)
    ; tdltruAttemptSub(O, Prev, BothFilteredTD, FilteredBU, BUClasses, InorderClasses, Visit, TDC, BUC, VO, InorderParent)).

tdltruAttemptSub(O, Prev, TDCandids, BUCandids, BUClasses, InorderClasses, Visit, TDC, BUC, VisitO, InorderParent) :-
  tdltruAttemptTrySub(
    O, Prev, TDCandids, BUCandids, BUClasses, InorderClasses, VisitAttempt, VAO, InvalidChildTDs, ReadyAfter, InorderParent),
  tdltruAttemptFilterSub(
    O, Prev, TDCandids, BUCandids, BUClasses, InorderClasses, VisitAttempt, VAO, InvalidChildTDs, ReadyAfter, 
    Visit, TDC, BUC, VisitO, InorderParent).

tdltruAttempt(O, Prev, TDCandids, BUCandids, Visit, TDC, BUC, VisitO) :-
  findall(C, class(C, _), Classes),
  tdltruAttemptSub(O, Prev, TDCandids, BUCandids, [], Classes, Visit, TDC, BUC, VisitO, true).  
   
% Idea: 
% 1. assume external TD assumes at entry
% 2. iterate over children:
%  a. require internal child.TD attribs before iteration step
%  b. assume external child.BU after iteration step
% 3. require all internal @ end
tdltru(O, Prev, Visit, Assume, VisitO) :-
  supersetCandidatesH(Prev, [], Candidates),
  tdltruAttempt(O, Prev, Candidates, Candidates, Visit, TDC, BUC, VisitO),
  topDownAssume(TDC, Prev, [], AssumeTD),
  bottomUpAssume(BUC, Prev, [], AssumeBottomUp), 
  append(AssumeTD, AssumeBottomUp, Assume2),
  bottomUpPostAssume(BUC, Prev, [], PostAssume),
  append(Assume2, PostAssume, Assume).


%%%%%%%%%%%%%%%%%%
% Add subtree inorder traversal to BU
%%%

%%
% search through all class labelings (2*C -- how to trim?) for valid subtree traversals
% * candidates for each
% (TODO pruning search optimization?)
% (heuristic for maximal parallelism or maximal candidates?)
%%

%self BU: FIXME check if only BU or only Inorder parents? 
bottomUpSubInorderHBU(O, Prev, TDCandids, BUCandids, Visit, Assume, BUClasses, InorderClasses, FiltTD, FiltBU, InorderParent) :-
  union(TDCandids, BUCandids, Candidates),
  bottomUpAssumeSub(Candidates, Prev, [], PreAssume, BUClasses),  %children set from below visit
  (InorderParent -> 
   (topDownAssumeSub(TDCandids, Prev, [], AssumeTD, BUClasses), %assume parent interface attribs  
    append(PreAssume, Prev, ReadyBefore1),
    append(ReadyBefore1, AssumeTD, ReadyBefore))
   ; append(PreAssume, Prev, ReadyBefore)),
  internalStepSub(ReadyBefore, VisitAttempt, BUClasses), %assume prev pass greedy, so only BU classes advance  
  bottomUpPostAssumeSub(Candidates, Prev, [], PostAssume, BUClasses),  %parent visit afterwords
  append(ReadyBefore, VisitAttempt, ReadyAfter1),  
  filterCandidatesSub(ReadyAfter1, Candidates, [], FilteredStep, BUClasses),
  intersection(TDCandids, FilteredStep, TDNext), intersection(BUCandids, FilteredStep, BUNext),
  append(PreAssume, PostAssume, Assumed),  
  ((setSame(TDCandids,TDNext), setSame(BUCandids, BUNext)) -> 
    (Visit = VisitAttempt, Assume = Assumed, FiltTD = TDNext, FiltBU = BUNext)
    ; bottomUpSubInorderHBU(O, Prev, TDNext, BUNext, Visit, Assume, BUClasses, InorderClasses, FiltTD, FiltBU, InorderParent)).

%self inorder: FIXME check if only BU or only Inorder parents?
bottomUpSubInorderHIn(O, Prev, TDCandids, BUCandids, Visit, Assume, VisitO, BUClasses, InorderClasses, FiltTD, FiltBU, InorderParent) :-
  tdltruAttemptSub(O, Prev, TDCandids, BUCandids, BUClasses, InorderClasses, Visit, FiltTD, FiltBU, VisitO, InorderParent),
  topDownAssumeSub(FiltTD, Prev, [], AssumeTD, InorderClasses),
  bottomUpAssumeSub(FiltBU, Prev, [], AssumeBottomUp, InorderClasses), 
  append(AssumeTD, AssumeBottomUp, Assume2),
  bottomUpPostAssume(FiltBU, Prev, [], PostAssume),
  append(Assume2, PostAssume, Assume).

%%%
% for a fixed bu vs. inorder class partitioning:
%   iteratively filter down TD / BU candidates to fixedpoint / failure
%   need to make sure node works if its parent is BU (so not visited before) and inorder (so visited before)
%   VisitO = (BU visits, inorder visits)
%%%
hasParentsOfType(Classes, Type, HasSet) :-
  findall(C, (member(C, Classes), class(C, I), classChild(PC, _, I), member(PC, Type)), HasList),
  list_to_set(HasList, HasSet).
rootClasses(Cs) :- findall(C, (class(C, I), \+ classChild(_,_,I)), Cs).
buInorderPick(A, B, VA, VB, V) :-
  findall( [C, N], (member(C, A), member([C, N], VA)), AHits),
  findall( (C, N), (member(C, A), member((C, N), VA)), AHits2),
  findall( [C, N], (member(C, B), \+ member(C, A), member([C, N], VB)), BNotAHits),
  findall( (C, N), (member(C, B), \+ member(C, A), member((C, N), VB)), BNotAHits2),
  union(AHits, BNotAHits, V1),
  union(AHits2, BNotAHits2, V2),
  union(V1, V2, V).
buInorderMerge(BUBU, IBU, BUI, II, V1, V2, V3, V4, V) :-
  buInorderPick(BUBU, IBU, V1, V2, V1R),
  buInorderPick(BUI, II, V3, V4, V2R),
  union(V1R, V2R, V).

bottomUpSubInorderH(O, Prev, TDCandids, BUCandids, Visit, Assume, VisitO, BUClasses, InorderClasses) :-
  rootClasses(Roots),
  hasParentsOfType(BUClasses, BUClasses, BUBUClassesRaw),
  findall(C, (member(C, BUClasses), member(C, Roots)), BURoots),
  append(BURoots, BUBUClassesRaw, BUBUClasses),
  bottomUpSubInorderHBU(O, Prev, TDCandids, BUCandids, Visit1, Assume1, BUBUClasses, InorderClasses, FiltCandTD1, FiltCandBU1, false),
  hasParentsOfType(BUClasses, InorderClasses, InorderBUClasses),
  bottomUpSubInorderHBU(O, Prev, FiltCandTD1, FiltCandBU1, Visit2, Assume2, InorderBUClasses, InorderClasses, FiltCandTD2, FiltCandBU2, true),
  hasParentsOfType(InorderClasses, BUClasses, BUInorderClassesRaw),
  findall(C, (member(C, InorderClasses), member(C, Roots)), InorderRoots),
  append(InorderRoots, BUInorderClassesRaw, BUInorderClasses),
  bottomUpSubInorderHIn(O, Prev, FiltCandTD2, FiltCandBU2, Visit3, Assume3, VisitO3, BUClasses, BUInorderClasses, FiltCandTD3, FiltCandBU3, false),
  hasParentsOfType(InorderClasses, InorderClasses, InorderInorderClasses),
  bottomUpSubInorderHIn(O, Prev, FiltCandTD3, FiltCandBU3, Visit4, Assume4, VisitO4, BUClasses, InorderInorderClasses, FiltCandTD4, FiltCandBU4, true),
  ((setSame(FiltCandTD1, FiltCandTD4), setSame(FiltCandBU1, FiltCandBU4)) ->  
    (buInorderMerge(BUBUClasses, InorderBUClasses, BUInorderClasses, InorderInorderClasses, Visit1, Visit2, Visit3, Visit4, Visit),
     buInorderMerge(BUBUClasses, InorderBUClasses, BUInorderClasses, InorderInorderClasses, Assume1, Assume2, Assume3, Assume4, Assume), 
     buInorderPick(BUBUClasses, InorderBUClasses, Visit1, Visit2, BUVisits),
     VisitO = ((BUClasses, InorderClasses), (BUVisits, BUInorderClasses, VisitO3, VisitO4)))
   ; bottomUpSubInorderH(O, Prev, FiltCandTD4, FiltCandBU4, Visit, Assume, VisitO, BUClasses, InorderClasses)).

%%%

bottomUpSubInorder(O, Prev, Visit, Assume, VisitO) :- % NowReady + Visit is all we can assume added
  %non determ partition classes  
  findall(C, class(C, _), Classes),
  VisitO = ((BUClasses, InorderClasses), _), %speedup if partial schedule available
  subsetManual(BUClasses, Classes), subtract(Classes, BUClasses, InorderClasses),
  BUClasses \= [], InorderClasses \= [],
  is_set(BUClasses), is_set(InorderClasses),
  supersetCandidatesH(Prev, [], SupCandidates),
  bottomUpSubInorderH(O, Prev, SupCandidates, SupCandidates, Visit, Assume, VisitO, BUClasses, InorderClasses),
  Visit \= [].

%%%%%%%%%%%%%%%%%%


%%%
% Uncomputed attributes (non-fields)
%%%

remaining(P,R) :-findall(
    [C,V], 
    (classNode(C,V), \+ member([C,V],P)),
    R).    
noneRemaining(P) :- remaining(P, []).


%%%
% stitch together topdown and bottomup visits to completion (or failure)
% (note: passes in right order, visits within pass are in reverse order)
% (TODO: insert recursive calls within tdltru pass; can do when using missing deps)
% optimization: do td first if prev was tdltr or bu, otherwise do it last
%%
%%%


flipOpt(_) :- true.
ftlStepH(_, Prev, Visit, Assume, td, Visit, _) :- 
	\+ flipOpt(true), topDown(Prev, Visit, Assume).
ftlStepH(_, Prev, Visit, Assume, td, Visit, ScheduleSoFar) :- 
	flipOpt(true),
	(ScheduleSoFar = [] ; (last(ScheduleSoFar, (_, D, _, _, _)), (D = bu ; D = tdLtrU)  )), 
	topDown(Prev, Visit, Assume).
ftlStepH(_, Prev, Visit, Assume, bu, Visit, _) :- bottomUp(Prev, Visit, Assume).
ftlStepH(O, Prev, Visit, Assume, tdLtrU, VO, _) :- tdltru(O, Prev, Visit, Assume, VO).
ftlStepH(_, Prev, Visit, Assume, td, Visit, ScheduleSoFar) :- 
	flipOpt(true),
	last(ScheduleSoFar, [(_, D, _, _, _)]),
	((D \= td) -> (D \= tdLtrU) -> topDown(Prev, Visit, Assume)) ; false.
ftlStepH(_, Prev, Visit, Assume, td, Visit, _) :- topDown(Prev, Visit, Assume).
%ftlStepH(O, Prev, Visit, Assume, buSubInorder, VO, _) :- bottomUpSubInorder(O, Prev, Visit, Assume, VO).
ftlStep(O, Prev, Visit, Assume, D, VisitO, ScheduleSoFar) :- ftlStepH(O, Prev, Visit, Assume, D, VisitO, ScheduleSoFar), Visit \= [].



%for enumerating all
%%FIXME: should really check that sequenceClassesHSingle works before trying to do more
sequenceClassesH(_, Prev, Prev, Schedule, Schedule) :- remaining(Prev, _), noneRemaining(Prev).
sequenceClassesH(O, Prev, Covered, ScheduleSoFar, Schedule) :- % step
  length(ScheduleSoFar, N), succ(N,NN), nth1(NN, Schedule, (_, Direction, _, _, VisitO)), %short circuiting to exploit typical Schedule constraints
  ftlStep(O, Prev, Visit, Assume, Direction, VisitO, ScheduleSoFar),
  append(Prev, Visit, Done1), append(Done1, Assume, Done),
  append(ScheduleSoFar, [(Visit, Direction, Prev, Assume, VisitO)], Order),
  sequenceClassesH(O, Done, Covered, Order, Schedule).

%for enumerating one
%only search increasingly long prefix (subject to sketch)
sequenceClassesHSingle(_, Prev, Prev, Schedule, Schedule) :- remaining(Prev, _), noneRemaining(Prev).
sequenceClassesHSingle(O, Prev, Covered, ScheduleSoFar, Schedule) :- % step
  length(ScheduleSoFar, N), succ(N,NN), nth1(NN, Schedule, (_, Direction, _, _, VisitO)), %short circuiting to exploit typical Schedule constraints
  (ftlStep(O, Prev, Visit, Assume, Direction, VisitO, ScheduleSoFar)
   ->
   (append(Prev, Visit, Done1), append(Done1, Assume, Done),
    append(ScheduleSoFar, [(Visit, Direction, Prev, Assume, VisitO)], Order),
    sequenceClassesHSingle(O, Done, Covered, Order, Schedule))).



sequenceClasses(O, Schedule) :- % start with sources
  grammarOrder(O), sources(S), sequenceClassesH(O, S, Covered, [], Schedule),  noneRemaining(Covered).
sequenceClassesFixed(O,Schedule) :- 
  grammarOrderFixed(O), sources(S), sequenceClassesH(O, S, Covered, [], Schedule),  noneRemaining(Covered).
sequenceClassesFixedSingle(O,Schedule) :- 
  grammarOrderFixed(O), sources(S), sequenceClassesHSingle(O, S, Covered, [], Schedule),  noneRemaining(Covered).

%%%
% report how many scheduable inorder traversals and what isn't scheduable
%%%

sequenceClassesPartialH(O, Prev, ScheduleSoFar, Schedule, I, N) :- % step
  (ftlStep(O, Prev, Visit, Assume, Direction, VisitO) ->
  (append(Prev, Visit, Done1), append(Done1, Assume, Done),
  append(ScheduleSoFar, [(Visit, Direction, Prev, Assume, VisitO)], Order),
  plus(I,1,NI),
  sequenceClassesPartialH(O, Done, Order, Schedule, NI, N)))
  ;
  (N = NI, Schedule = ScheduleSoFar).

sequenceClassesPartial(O, Schedule, N) :- % start with sources
  grammarOrder(O), sources(S), sequenceClassesPartialH(O, S, [], Schedule, 0, N).
countSteps(N, Remaining) :- 
  grammarOrderFixed(O), sequenceClassesPartial(O, Schedule, N), 
  append(_, [(Visit, _, Prev, Assume, _)], Schedule),
  append(Visit, Prev, Done1), append(Done1, Assume, Done),
  remaining(Done, [], Remaining).
  %Remaining = Done.



%%%
% pretty printers
%%%

classOrder(C, O) :- findall(N, classChild(C, N, _), O).
pickOrder([], []).
pickOrder([C | RestC], [(C,O) | RestO]) :- classOrder(C, OP), permutation(OP,O), pickOrder(RestC, RestO).
grammarOrder(GO) :- setof(C, class(C, _), Classes), pickOrder(Classes, GO).
pickOrderFixed([], []).
pickOrderFixed([C | RestC], [(C,O) | RestO]) :- classOrder(C, O), pickOrderFixed(RestC, RestO).
grammarOrderFixed(GO) :- findall(C, class(C, _), Classes), pickOrderFixed(Classes, GO).


