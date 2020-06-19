package ca.firstvoices.cognito;

import static org.junit.Assert.assertEquals;
import com.amazonaws.services.cognitoidp.model.PasswordPolicyType;
import java.util.Arrays;
import org.junit.Test;

public class AWSPasswordValidatorTest {

  private static class ExpectedResult {
    String input;
    boolean expectedResult;

    public ExpectedResult(String input, boolean expectedResult) {
      this.input = input;
      this.expectedResult = expectedResult;
    }
  }

  @Test
  public void testLoosePasswordValidation() {
    AWSPasswordValidator loose = new AWSPasswordValidator(
        new PasswordPolicyType()
            .withMinimumLength(6)
            .withRequireLowercase(false)
            .withRequireUppercase(false)
            .withRequireNumbers(false)
            .withRequireSymbols(false)
    );

    ExpectedResult[] tests = {
        new ExpectedResult(null, false),
        new ExpectedResult("abcd", false),
        new ExpectedResult("abcdef", true),
        new ExpectedResult("abcdef不可以", false)
    };

    Arrays.stream(tests).forEach(er -> {
      assertEquals("Expected result not realised for test " + er.input,
          er.expectedResult,
          loose.validatePassword(er.input)
      );
    });
  }

  @Test
  public void testStrictPasswordValidation() {
    AWSPasswordValidator strict = new AWSPasswordValidator(
        new PasswordPolicyType()
            .withMinimumLength(10)
            .withRequireLowercase(true)
            .withRequireUppercase(true)
            .withRequireNumbers(true)
            .withRequireSymbols(true)
    );

    ExpectedResult[] tests = {
        new ExpectedResult(null, false),
        new ExpectedResult("abcd", false),
        new ExpectedResult("abcdef", false),
        new ExpectedResult("abcdefghij", false),
        new ExpectedResult("ABCDEFGHIJ", false),
        new ExpectedResult("ABCDEFGHIJ!", false),
        new ExpectedResult("AbcDEFGHIJ!", false),
        new ExpectedResult("AbcDE5GHIJ+", false),
        new ExpectedResult("A33bcDEFGHIJ!", true),
        new ExpectedResult("abcdef不可以", false),
        new ExpectedResult("abBC3@不可以", false)

    };

    Arrays.stream(tests).forEach(er -> {
      assertEquals("Expected result not realised for test " + er.input,
          er.expectedResult,
          strict.validatePassword(er.input)
      );
    });
  }

}
