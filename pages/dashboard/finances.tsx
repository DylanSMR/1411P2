// pages/index.js
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";
import React from "react";
import Navbar from "../../components/nav";
import Moment from "moment";
import useApi from "../../lib/useApi";
import Container from "../../modules/container";
import CreateExpense from "../../popups/dashboard/finances/CreateExpense";
import CreateIncome from "../../popups/dashboard/finances/CreateIncome";
import DeleteFinance from "../../popups/dashboard/finances/DeleteFinance";
import EditExpense from "../../popups/dashboard/finances/EditExpense";
import EditIncome from "../../popups/dashboard/finances/EditIncome";
import ConvertCase from "js-convert-case";
import moment from "moment";

const FinanceDashboard: NextPage = (props) => {
    let {
        response: finance,
        fetching,
    } = useApi("/api/user/finance/");

    if (finance == undefined || fetching) {
        return (
            <Container title="ENGR 1411 | Finance Dashboard" loading={true} />
        );
    }

    let lastDate = Moment(new Date(1900, 1, 1));
    return (
        <Container
            title="ENGR 1411 | Finance Dashboard"
            className={"flex"}
            loading={fetching}
        >
            <Navbar />

            <div
                className="flex column width-fill"
                style={{ paddingRight: "1rem", overflowY: "scroll" }}
            >
                <h1
                    style={{
                        borderBottom: "2px solid var(--color-bg-secondary)",
                        marginBottom: "0.2rem",
                    }}
                >
                    Finances
                </h1>

                <h2> Income Sources </h2>
                <div className="table">
                    <table id="incomeTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Period</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finance.finances
                                .filter((y: any) => y.type == "INCOME")
                                .filter((y: any) => {
                                    // To reduce the table size, lets only show current month income
                                    // if they occur once. Any other expense that occurs more than once
                                    // can be shown still
                                    if(y.period == 'once' && 
                                        !moment().isSame(moment(y.start), 'month')) return false;
                                    else return true;
                                })
                                .sort((x: any, y: any) => Moment(x.start).isAfter(y.start))
                                .map((x: any) => {
                                    return (
                                        <tr key={x.id}>
                                            <td> {x.title} </td>
                                            <td>
                                                $
                                                {parseFloat(
                                                    x.amount
                                                ).toLocaleString("en-US")}
                                            </td>
                                            <td> {ConvertCase.toSentenceCase(x.period)} </td>
                                            <td>
                                                {Moment(x.start).format(
                                                    "MM/DD/YYYY"
                                                )}
                                            </td>
                                            <td>
                                                {x.end != undefined
                                                    ? Moment(x.end).format(
                                                        "MM/DD/YYYY"
                                                    )
                                                    : "None"}
                                            </td>
                                            <td className="tableActions">
                                                <EditIncome current={x} />
                                                <DeleteFinance title={x.title} amount={x.amount} id={x.id} />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>

                    <CreateIncome />
                </div>

                <h2> Expenses </h2>
                <div className="table">
                    <table id="incomeTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Period</th>
                                <th>Category</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finance.finances
                                .filter((y: any) => y.type == "EXPENSE")
                                .sort((x: any, y: any) => Moment(y.start).valueOf() - Moment(x.start).valueOf())
                                .map((x: any) => {
                                    if(!Moment(x.start).isSame(lastDate, 'month')) {
                                        lastDate = Moment(x.start);
                                        return ([
                                            <tr className="tableSubHeader">
                                                { Moment(lastDate).format("MMMM YY") }
                                            </tr>,
                                            <tr key={x.id}>
                                                <td> {x.title} </td>
                                                <td>
                                                    $
                                                    {parseFloat(
                                                        x.amount
                                                    ).toLocaleString("en-US")}
                                                </td>
                                                <td> {ConvertCase.toSentenceCase(x.period)} </td>
                                                <td> {ConvertCase.toSentenceCase(x.category)} </td>
                                                <td>
                                                    {Moment(x.start).format(
                                                        "MM/DD/YYYY"
                                                    )}
                                                </td>
                                                <td>
                                                    {x.end != undefined
                                                        ? Moment(x.end).format(
                                                            "MM/DD/YYYY"
                                                        )
                                                        : "None"}
                                                </td>
                                                <td className="tableActions">
                                                    <EditExpense current={x} />
                                                    <DeleteFinance title={x.title} amount={x.amount} id={x.id} />
                                                </td>
                                            </tr>
                                        ])
                                    }

                                    return (
                                        <tr key={x.id}>
                                            <td> {x.title} </td>
                                            <td>
                                                $
                                                {parseFloat(
                                                    x.amount
                                                ).toLocaleString("en-US")}
                                            </td>
                                            <td> {ConvertCase.toSentenceCase(x.period)} </td>
                                            <td> {ConvertCase.toSentenceCase(x.category)} </td>
                                            <td>
                                                {Moment(x.start).format(
                                                    "MM/DD/YYYY"
                                                )}
                                            </td>
                                            <td>
                                                {x.end != undefined
                                                    ? Moment(x.end).format(
                                                        "MM/DD/YYYY"
                                                    )
                                                    : "None"}
                                            </td>
                                            <td className="tableActions">
                                                <EditExpense current={x} />
                                                <DeleteFinance title={x.title} amount={x.amount} id={x.id} />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>

                    <CreateExpense />
                </div>
            </div>
        </Container>
    );
};

export default withPageAuthRequired(FinanceDashboard);
