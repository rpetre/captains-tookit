# captains-toolkit
toy project to play along with factory data from the Captain of Industry game

This is meant to be a reimplementation of https://github.com/David-Melo/captains-calculator  (named CC whenever mentioned below) since the author abandoned it midway (at least for now) and it's centered around some assumptions that I don't quite understand the goal of (a single top-level factory for instance).

This is not intended to become a working product and it's being made solely for my entertainment and education. I might decide to also abandon it whenever I find something more fun to play with. In fact the only reason I'm making this public is that maybe I'll share some ideas with David at some point in the future, should he pick up his project again.

## design goals

0. Learning React

Hacking on CC was the first time I played with React so it's a good excuse to try to do something useful with it. I will also try to borrow some ideas from it as well. It's not a fork since some of the ideas I have seem to be quite complicated to implement in the existing codebase (I have some local modifications that became way too complicated before it worked). It's very possible that after a while those design decisions would become apparent and I'd just fork CC and abandon this.

1. Subfactory design

The main thing I needed an external tool for was to summarize some of the more complex production chains in mid-to-late game, solving issues like "what basic materials and what amount do I need to keep 3 labs running?". This is something that CC kinda does, except it becomes difficult for complex production chains and it does multiple factories of the same type poorly (there's a hidden machine count variable that's not yet used).

2. Flow calculation

Since CoI is centered around the idea of conservation of materials, dealing with side products becomes complex pretty fast. I'd like to visualize output blocked / input starved factories and somehow predict the flow rate and number of factories. Having looked into other similar tools (for Factorio, for instance), the linear algebra approach becomes ridiculously complex with so many variables, especially with product loops involved. It's might also be a problem UI-wise to define the constraints of the system. I'm pondering a couple of ideas that might make this simpler, starting with something dumb like highlighting imbalances and asking the user to update the numbers until they converge.

Flow rate visualization is also important in COI since it can pinpoint what factories need to be colocated to use belts/pipes instead of trucks.

3. Splitters/balancers

CC is cheating a bit on the flow rate since it computes graph edge flow rate on edge creation and it becomes fairly complicated to update it after several other links are placed/deleted for the same product (or when the number of machines changes in upstream/downstream). I'm thinking of introducing splitters/joiners that prioritize one leg over the other as hints for the flow calculator.

4. Graph layout

React-flow has some weird limitations but I haven't heard of a better alternative. Rearranging the nodes is one of them (another problem that's ridiculously hard once you go into theory), but it could still be helpful if done a) on demand and b) ignoring low-priority links for byproducts.

5. Non-obvious data

That's the stuff that perhaps requires hacking the DataExtractor mod to get numbers for stuff that's not very visible in-game, like:
- average input/output of farm type, based on parameters like crop schedule and fertilizer level
- recyclables to scrap ratios, based on tech level
- pop consumption rates of food/water/goods
