
    1. Easiness factor:
      The Easiness Factor (EF) represents the factor the interval of when a card is shown is multiplied by. 
      EF only applies after graduation is 1.3x.


    2. Learning and Graduation:
      A new card starts in the learning stage whcih is represented by 3 learning steps, each with increasing intervals.
      Learning steps:
        1 - 1 minute
        2 - 5 minutes
        3 - 10 minutes

      When a card is at the 3rd learning step two times in a row or is given a rating of "Easy", it goes into the graduation stage.
      Each card after graduating is given a new interval of 1 day and an Easiness factor of 2.5x (See Easiness Factor below).

      Ratings:
        Again - User did not know the answer.
          -Learning: Card goes to first step.
          -Graduation: Immedietly goes back to learning on step 1.

        Hard - Correct response with larger hesitation and/or uncertanty.
          -Learning: Card is given the average interval if the card were rated Again and Good. Default is 5.5 minutes.
          -Graduation: See Hard Penalty. 

        Good - Correct response with little hesitation
          -Learning: Card goes to the third step, unless it is the second rating of Good in a row, graduating the card.
          -Graduation: No changes.

        Easy - User knew the answer with zero hesitation.
          -Learning: Card immediatly goes to the graduation stage starting at a 1 day interval.
          -Graduation: See Easy Bonus.

      The max interval is 1 year (MC).

    3. Easy Bonus:
      If a graduated card is given a rating of Easy, the old interval that will normally be multiplied by the EF, will also be multiplied by the Easy Bonus.
      The default easy bonus is 1.3x
    
    4. Hard Penalty:
      If a graduated card is given a rating of Hard, the new interval will be the old interval divided by 1.2x. (MC)

    4. Lapsed Cards
      A lapsed card is a graduated card that goes back into the Learning stage if the user rates the card with "Again".
      The new starting interval will be 0.6x the old interval (MC).
      

    5. Leech cards.
      Leech cards are cards that have lapsed 6 times.
      The user is not told whether a card is put into the leech category and leech cards will not show up for review.
      However, leech cards can be reverted back to review cards manually by the user in the edit settings of a deck.
