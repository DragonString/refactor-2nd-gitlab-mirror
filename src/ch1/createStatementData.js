class PerformanceCalculator {
    constructor(aPerformance, aplay) {
        this.performance = aPerformance;
        this.play = aplay;
    }

    get amount() {
        let result = 0;

        switch (this.play.type) {
            case "tragedy": // 비극
                throw "오류 발생";

            case "comedy": // 희극
                result = 30000;
                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;

            default:
                throw new Error(`알 수 없는 장르: ${this.play.type}`);
        }

        return result;
    }

    get volumeCredits() {
        let result = 0;

        result += Math.max(this.performance.audience - 30, 0);
        if ("comedy" === this.play.type)
            result += Math.floor(this.performance.audience / 5);

        return result;
    }
}

class TragedyCalculator extends PerformanceCalculator{
    get amount() {
        let result = 40000;

        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }

        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
}

function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
        case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
        case "comedy": return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`알 수 없는 장르: ${this.play.type}`);
    }
}

export default function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        return data.performances
            .reduce((total, p) => total + p.volumeCredits, 0);
    }
}